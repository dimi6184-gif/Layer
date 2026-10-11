// Fetch Discord channels for a guild

const DISCORD_API_BASE = "https://discord.com/api/v10";

export async function fetchGuildChannels(guildId: string) {
  try {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
      console.error("DISCORD_BOT_TOKEN not found");
      return [];
    }

    const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch channels for guild ${guildId}:`, response.status);
      return [];
    }

    const channels = await response.json();
    
    // Filter only text channels (type 0) and announcement channels (type 5)
    const textChannels = channels
      .filter((ch: any) => ch.type === 0 || ch.type === 5)
      .map((ch: any) => ({
        id: ch.id,
        name: ch.name,
        type: ch.type,
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return textChannels;
  } catch (error) {
    console.error("Error fetching guild channels:", error);
    return [];
  }
}

export async function fetchGuildRoles(guildId: string) {
  try {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
      console.error("DISCORD_BOT_TOKEN not found");
      return [];
    }

    const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/roles`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch roles for guild ${guildId}:`, response.status);
      return [];
    }

    const roles = await response.json();
    
    // Filter out @everyone and sort by position
    const filteredRoles = roles
      .filter((role: any) => role.name !== "@everyone")
      .map((role: any) => ({
        id: role.id,
        name: role.name,
        color: role.color,
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return filteredRoles;
  } catch (error) {
    console.error("Error fetching guild roles:", error);
    return [];
  }
}
