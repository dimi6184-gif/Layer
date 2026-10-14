"use server";

import { auth } from "@/auth";
import { db } from "@nexus/db";
import { revalidatePath } from "next/cache";
import { PERMISSIONS, ROLE_PRESETS } from "@/lib/team-permissions";

// Check if user has permission
export async function hasPermission(guildId: string, permission: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  // Check team membership (only active members)
  const teamMember = await db.teamMember.findUnique({
    where: {
      guildId_userId: {
        guildId,
        userId: session.user.id,
      },
    },
  });

  if (!teamMember || teamMember.status !== "active") return false;

  const permissions = teamMember.permissions as { permissions: string[] };
  // Wildcard permission (*) grants everything — used for owners
  return permissions.permissions.includes("*") || permissions.permissions.includes(permission);
}

// Ensure user is a team member (auto-add as owner if first user)
export async function ensureTeamMember(guildId: string, userId: string, username: string) {
  // Check if user is already a team member
  const existing = await db.teamMember.findUnique({
    where: {
      guildId_userId: {
        guildId,
        userId,
      },
    },
  });

  if (existing) {
    // If status is declined but they're the only member, reactivate them as owner
    if (existing.status === "declined") {
      const teamMemberCount = await db.teamMember.count({
        where: { 
          guildId,
          status: "active",
        },
      });

      if (teamMemberCount === 0) {
        // Reactivate as owner
        const updated = await db.teamMember.update({
          where: { id: existing.id },
          data: {
            status: "active",
            role: "owner",
            permissions: {
              permissions: ROLE_PRESETS.owner.permissions,
            },
          },
        });
        return updated;
      }
    }
    return existing;
  }

  // Check if there are any team members for this guild
  const teamMemberCount = await db.teamMember.count({
    where: { guildId },
  });

  // If no team members exist, make this user the owner (auto-active)
  if (teamMemberCount === 0) {
    // Get or create user
    let user = await db.user.findUnique({
      where: { discordId: userId },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          discordId: userId,
          username,
        },
      });
    }

    // Create owner team member (auto-active)
    const teamMember = await db.teamMember.create({
      data: {
        guildId,
        userId,
        role: "owner",
        status: "active", // Owner is automatically active
        permissions: {
          permissions: ROLE_PRESETS.owner.permissions,
        },
      },
    });

    return teamMember;
  }

  return null;
}

// Get team members for a guild
export async function getTeamMembers(guildId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if user has permission to view team
  const canView = await hasPermission(guildId, PERMISSIONS.VIEW_TEAM);
  if (!canView) {
    throw new Error("You don't have permission to view team members");
  }

  const teamMembers = await db.teamMember.findMany({
    where: { guildId },
    include: {
      user: {
        select: {
          username: true,
          discordId: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return teamMembers;
}

// Add team member
export async function addTeamMember(
  guildId: string,
  discordId: string,
  username: string,
  role: keyof typeof ROLE_PRESETS
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if user has permission to manage team
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_TEAM);
  if (!canManage) {
    throw new Error("You don't have permission to manage team members");
  }
  
  // Cannot invite as the system "owner" role — use "co_owner" instead
  if (role === "owner") {
    throw new Error("Cannot invite as 'owner'. Use 'Co-Owner' instead — it has the same permissions.");
  }

  // Fetch Discord user info
  const { fetchDiscordUser } = await import("@/lib/discord-api");
  const discordUser = await fetchDiscordUser(discordId);
  
  if (!discordUser) {
    throw new Error("Could not fetch Discord user. Make sure the ID is correct.");
  }

  const displayName = discordUser.globalName || discordUser.username;

  // Get or create user
  let user = await db.user.findUnique({
    where: { discordId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        discordId,
        username: displayName,
      },
    });
  } else {
    // Update username if changed
    await db.user.update({
      where: { discordId },
      data: { username: displayName },
    });
  }

  // Check if already a team member
  const existing = await db.teamMember.findUnique({
    where: {
      guildId_userId: {
        guildId,
        userId: discordId,
      },
    },
  });

  if (existing) {
    if (existing.status === "pending") {
      throw new Error("This user already has a pending invitation");
    }
    if (existing.status === "active") {
      // Better error message for self-invite attempt
      if (discordId === session.user.id) {
        throw new Error("You cannot invite yourself - you are already a team member");
      }
      throw new Error("This user is already a team member");
    }
    if (existing.status === "declined") {
      // Allow re-inviting if they declined before
      await db.teamMember.update({
        where: { id: existing.id },
        data: {
          status: "pending",
          role,
          permissions: {
            permissions: ROLE_PRESETS[role].permissions,
          },
          invitedBy: session.user.id,
        },
      });
      
      revalidatePath(`/dashboard/${guildId}/team`);
      return existing;
    }
  }

  // Create team member with pending status
  const rolePreset = ROLE_PRESETS[role];
  const teamMember = await db.teamMember.create({
    data: {
      guildId,
      userId: discordId,
      role,
      permissions: {
        permissions: rolePreset.permissions,
      },
      invitedBy: session.user.id,
      status: "pending",
    },
  });

  // Log action
  await db.auditLog.create({
    data: {
      guildId,
      action: "TEAM_MEMBER_INVITED",
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      details: `Invited ${displayName} as ${rolePreset.name}`,
      metadata: {
        targetUserId: discordId,
        role,
      },
    },
  });

  revalidatePath(`/dashboard/${guildId}/team`);
  return teamMember;
}

// Update team member role
export async function updateTeamMemberRole(
  guildId: string,
  userId: string,
  role: keyof typeof ROLE_PRESETS
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if user has permission to manage team
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_TEAM);
  if (!canManage) {
    throw new Error("You don't have permission to manage team members");
  }

  // Cannot change owner role
  const teamMember = await db.teamMember.findUnique({
    where: {
      guildId_userId: {
        guildId,
        userId,
      },
    },
  });

  if (teamMember?.role === "owner") {
    throw new Error("Cannot change the owner's role");
  }
  
  // Cannot promote to system owner role
  if (role === "owner") {
    throw new Error("Cannot promote someone to owner. Use 'Co-Owner' instead.");
  }

  // Update role
  const rolePreset = ROLE_PRESETS[role];
  const updated = await db.teamMember.update({
    where: {
      guildId_userId: {
        guildId,
        userId,
      },
    },
    data: {
      role,
      permissions: {
        permissions: rolePreset.permissions,
      },
    },
  });

  // Log action
  await db.auditLog.create({
    data: {
      guildId,
      action: "TEAM_MEMBER_UPDATED",
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      details: `Changed role to ${rolePreset.name}`,
      metadata: {
        targetUserId: userId,
        newRole: role,
      },
    },
  });

  revalidatePath(`/dashboard/${guildId}/team`);
  return updated;
}

// Remove team member
export async function removeTeamMember(guildId: string, userId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if user has permission to manage team
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_TEAM);
  if (!canManage) {
    throw new Error("You don't have permission to manage team members");
  }

  // Cannot remove owner
  const teamMember = await db.teamMember.findUnique({
    where: {
      guildId_userId: {
        guildId,
        userId,
      },
    },
    include: {
      user: true,
    },
  });

  if (teamMember?.role === "owner") {
    throw new Error("Cannot remove owner");
  }
  
  // SECURITY: Cannot remove yourself
  if (userId === session.user.id) {
    throw new Error("You cannot remove yourself from the team");
  }

  // Remove team member
  await db.teamMember.delete({
    where: {
      guildId_userId: {
        guildId,
        userId,
      },
    },
  });

  // Log action
  await db.auditLog.create({
    data: {
      guildId,
      action: "TEAM_MEMBER_REMOVED",
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      details: `Removed ${teamMember?.user.username} from team`,
      metadata: {
        targetUserId: userId,
      },
    },
  });

  revalidatePath(`/dashboard/${guildId}/team`);
}

// Update custom permissions
export async function updateTeamMemberPermissions(
  guildId: string,
  userId: string,
  permissions: string[]
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if user has permission to manage team
  const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_TEAM);
  if (!canManage) {
    throw new Error("You don't have permission to manage team members");
  }

  // Cannot change owner permissions
  const teamMember = await db.teamMember.findUnique({
    where: {
      guildId_userId: {
        guildId,
        userId,
      },
    },
  });

  if (teamMember?.role === "owner") {
    throw new Error("Cannot change owner permissions");
  }

  // SECURITY: Prevent privilege escalation — no one can grant wildcard or owner-level perms
  const FORBIDDEN_PERMISSIONS = ["*", "OWNER"];
  const sanitizedPermissions = permissions.filter(p => !FORBIDDEN_PERMISSIONS.includes(p));
  
  // Cannot change your own permissions
  if (userId === session.user.id) {
    throw new Error("You cannot change your own permissions");
  }

  // Update permissions
  const updated = await db.teamMember.update({
    where: {
      guildId_userId: {
        guildId,
        userId,
      },
    },
    data: {
      role: "custom",
      permissions: {
        permissions: sanitizedPermissions,
      },
    },
  });

  // Log action
  await db.auditLog.create({
    data: {
      guildId,
      action: "TEAM_MEMBER_PERMISSIONS_UPDATED",
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      details: `Updated custom permissions`,
      metadata: {
        targetUserId: userId,
        permissions,
      },
    },
  });

  revalidatePath(`/dashboard/${guildId}/team`);
  return updated;
}


// Accept team invitation
export async function acceptTeamInvite(guildId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const teamMember = await db.teamMember.findUnique({
    where: {
      guildId_userId: {
        guildId,
        userId: session.user.id,
      },
    },
  });

  if (!teamMember) {
    throw new Error("No invitation found");
  }

  if (teamMember.status !== "pending") {
    throw new Error("Invitation is not pending");
  }

  // Update status to active
  const updated = await db.teamMember.update({
    where: { id: teamMember.id },
    data: { status: "active" },
  });

  // Audit log
  await db.auditLog.create({
    data: {
      guildId,
      action: "TEAM_INVITE_ACCEPTED",
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      details: `Accepted team invitation`,
      metadata: {
        role: teamMember.role,
      },
    },
  });

  revalidatePath(`/dashboard/${guildId}/team`);
  revalidatePath(`/dashboard/${guildId}`);
  revalidatePath(`/dashboard`);
  revalidatePath(`/invites`);
  return updated;
}

// Decline team invitation
export async function declineTeamInvite(guildId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const teamMember = await db.teamMember.findUnique({
    where: {
      guildId_userId: {
        guildId,
        userId: session.user.id,
      },
    },
  });

  if (!teamMember) {
    throw new Error("No invitation found");
  }

  if (teamMember.status !== "pending") {
    throw new Error("Invitation is not pending");
  }

  // Update status to declined
  await db.teamMember.update({
    where: { id: teamMember.id },
    data: { status: "declined" },
  });

  // Log action
  await db.auditLog.create({
    data: {
      guildId,
      action: "TEAM_INVITE_DECLINED",
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      details: `Declined team invitation`,
      metadata: {
        role: teamMember.role,
      },
    },
  });

  revalidatePath(`/dashboard/${guildId}/team`);
  revalidatePath(`/invites`);
}

// Get pending invites for current user
export async function getPendingInvites() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const invites = await db.teamMember.findMany({
    where: {
      userId: session.user.id,
      status: "pending",
    },
    include: {
      guild: {
        select: {
          discordId: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const { fetchDiscordUser } = await import("@/lib/discord-api");

  const invitesWithDetails = await Promise.all(
    invites.map(async (invite) => {
      let inviterName = null;
      let guildIcon: string | null = null;
      let guildName = invite.guild.name;

      // Fetch inviter name
      if (invite.invitedBy) {
        const inviter = await db.user.findUnique({
          where: { discordId: invite.invitedBy },
          select: { username: true },
        });
        if (inviter) {
          inviterName = inviter.username;
        } else {
          const discordUser = await fetchDiscordUser(invite.invitedBy);
          if (discordUser) inviterName = discordUser.globalName || discordUser.username;
        }
      }

      // Fetch real server name + icon from Discord API
      try {
        const guildRes = await fetch(
          `https://discord.com/api/v10/guilds/${invite.guild.discordId}`,
          {
            headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
            next: { revalidate: 60 },
          }
        );
        if (guildRes.ok) {
          const guildData = await guildRes.json();
          guildName = guildData.name || guildName;
          if (guildData.icon) {
            guildIcon = `https://cdn.discordapp.com/icons/${invite.guild.discordId}/${guildData.icon}.png?size=64`;
          }
          // Update guild name in DB if it changed
          if (guildData.name && guildData.name !== invite.guild.name) {
            await db.guild.update({
              where: { discordId: invite.guild.discordId },
              data: { name: guildData.name },
            }).catch(() => {});
          }
        }
      } catch {
        // Discord API unavailable — use stored name
      }

      return {
        ...invite,
        inviterName,
        guildIcon,
        guildName,
      };
    })
  );

  return invitesWithDetails;
}
