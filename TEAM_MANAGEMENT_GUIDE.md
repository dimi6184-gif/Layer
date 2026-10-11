# 👥 Team Management System

## Overview
The Team Management System allows server owners to invite team members and grant them specific permissions to manage different parts of the dashboard.

---

## 🎯 Features

### ✅ Role-Based Access Control (RBAC)
- **Owner**: Full access to everything (cannot be removed or changed)
- **Admin**: Almost full access, cannot manage team
- **Moderator**: Moderation, tickets, and anti-scam only
- **Event Manager**: Manage events, giveaways, and announcements
- **Support**: Tickets and AI settings only
- **Viewer**: Read-only access to everything
- **Custom**: Fully customizable permissions

### ✅ Granular Permissions
Each role has specific permissions:
- `VIEW_DASHBOARD` - View dashboard overview
- `MANAGE_MODULES` - Enable/disable modules
- `VIEW_MODERATION` / `MANAGE_MODERATION` - Moderation settings
- `VIEW_LEVELING` / `MANAGE_LEVELING` - Leveling system
- `VIEW_MUSIC` / `MANAGE_MUSIC` - Music settings
- `VIEW_TICKETS` / `MANAGE_TICKETS` - Ticket system
- `VIEW_AI` / `MANAGE_AI` - AI settings
- `VIEW_ANTISCAM` / `MANAGE_ANTISCAM` - Anti-scam settings
- `VIEW_TEAM` / `MANAGE_TEAM` - Team management
- `VIEW_LOGS` - Audit logs

### ✅ Audit Logging
All team actions are logged:
- Team member added
- Team member removed
- Role changed
- Permissions updated

---

## 📋 How to Use

### 1. Access Team Management
Navigate to: `/dashboard/{server-id}/team`

### 2. Add Team Member
1. Click "Add Member" button
2. Enter Discord User ID (enable Developer Mode in Discord → Right-click user → Copy User ID)
3. Enter username
4. Select role
5. Click "Add Member"

### 3. Change Member Role
- Use the dropdown next to each member to change their role
- Changes apply immediately

### 4. Remove Team Member
- Click the trash icon next to a member
- Confirm removal
- Owner cannot be removed

---

## 🔧 Technical Implementation

### Database Schema
```prisma
model TeamMember {
  id          String   @id @default(cuid())
  guildId     String
  userId      String
  role        String   // "owner", "admin", "moderator", etc.
  permissions Json     // Granular permissions object
  invitedBy   String?  // Discord ID of who invited them
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  guild       Guild    @relation(fields: [guildId], references: [discordId], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [discordId], onDelete: Cascade)
  
  @@unique([guildId, userId])
}
```

### Backend Actions
- `getTeamMembers(guildId)` - Get all team members
- `addTeamMember(guildId, discordId, username, role)` - Add new member
- `updateTeamMemberRole(guildId, userId, role)` - Change role
- `removeTeamMember(guildId, userId)` - Remove member
- `updateTeamMemberPermissions(guildId, userId, permissions)` - Custom permissions
- `hasPermission(guildId, permission)` - Check if user has permission
- `ensureTeamMember(guildId, userId, username)` - Auto-add owner on first access

### Permission Checks
Every protected page/action should check permissions:
```typescript
import { hasPermission, PERMISSIONS } from "@/actions/team";

const canManage = await hasPermission(guildId, PERMISSIONS.MANAGE_MODERATION);
if (!canManage) {
  // Show error or redirect
}
```

---

## 🎨 UI Components

### TeamManagement Component
- Located: `apps/web/src/components/TeamManagement.tsx`
- Features:
  - Add member form
  - Team members list
  - Role badges with colors
  - Role selector dropdown
  - Remove member button
  - Permissions preview

### Team Page
- Located: `apps/web/src/app/(app)/dashboard/[id]/team/page.tsx`
- Auto-creates owner on first access
- Permission checks before rendering

---

## 🚀 Future Enhancements

### Planned Features
1. **Invite Links** - Generate invite links instead of manual Discord ID entry
2. **Permission Templates** - Save custom permission sets as templates
3. **Time-Limited Access** - Set expiration dates for team members
4. **Activity Dashboard** - See what each team member has done
5. **Notifications** - Notify users when they're added/removed
6. **Discord Role Sync** - Auto-sync with Discord server roles

### Premium Features
- Unlimited team members (free tier: 5 members)
- Custom roles with granular permissions
- Advanced audit logs with filters
- Team activity analytics

---

## 📊 Role Comparison

| Permission | Owner | Admin | Moderator | Event Manager | Support | Viewer |
|------------|-------|-------|-----------|---------------|---------|--------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Modules | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Moderation | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Tickets | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Manage AI | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Manage Anti-Scam | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Team | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Logs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔒 Security Notes

1. **Owner Protection**: Owner role cannot be changed or removed
2. **Permission Validation**: All actions validate permissions server-side
3. **Audit Trail**: All team changes are logged
4. **Discord ID Verification**: Users must provide valid Discord IDs
5. **Session Checks**: All actions require valid authentication

---

## 🐛 Troubleshooting

### "Access Denied" Error
- Make sure you're a team member
- Check if you have the required permission
- Contact the server owner

### Cannot Add Member
- Verify Discord ID is correct (18-digit number)
- Check if user is already a team member
- Ensure you have `MANAGE_TEAM` permission

### Permission Not Working
- Refresh the page
- Check if your role has the required permission
- Contact the server owner to update your role

---

## 📝 Example Usage

### Adding a Moderator
```typescript
await addTeamMember(
  "1234567890", // Guild ID
  "9876543210", // User Discord ID
  "ModeratorName", // Username
  "moderator" // Role
);
```

### Checking Permission
```typescript
const canManage = await hasPermission(
  "1234567890", // Guild ID
  PERMISSIONS.MANAGE_MODERATION
);

if (canManage) {
  // Allow action
}
```

---

## 🎉 Benefits

✅ **Better Organization** - Delegate tasks to team members
✅ **Increased Security** - Limit access to sensitive settings
✅ **Audit Trail** - Track who changed what
✅ **Scalability** - Manage large servers with multiple admins
✅ **Flexibility** - Custom roles for specific needs
✅ **Professional** - Like MEE6, Dyno, Carl-bot

---

**Status**: ✅ Fully Implemented
**Version**: 1.0.0
**Last Updated**: June 1, 2026
