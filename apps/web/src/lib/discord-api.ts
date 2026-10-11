// Discord API utilities

const DISCORD_API_BASE = "https://discord.com/api/v10";

export async function fetchDiscordUser(userId: string) {
  try {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
      console.error("DISCORD_BOT_TOKEN not found");
      return null;
    }

    const response = await fetch(`${DISCORD_API_BASE}/users/${userId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch Discord user ${userId}:`, response.status);
      return null;
    }

    const user = await response.json();
    return {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      globalName: user.global_name,
      avatar: user.avatar,
    };
  } catch (error) {
    console.error("Error fetching Discord user:", error);
    return null;
  }
}

export function getDiscordAvatarUrl(userId: string, avatarHash: string | null) {
  if (!avatarHash) {
    // Default avatar
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
}
