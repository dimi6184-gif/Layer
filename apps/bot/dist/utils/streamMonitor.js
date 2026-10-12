import { TextChannel, EmbedBuilder } from "discord.js";
import { db } from "../db.js";
export class StreamMonitor {
    client;
    checkInterval = null;
    CHECK_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes
    constructor(client) {
        this.client = client;
    }
    start() {
        console.log("[StreamMonitor] Starting stream monitor...");
        // Initial check
        this.checkAllStreams();
        // Set up interval
        this.checkInterval = setInterval(() => {
            this.checkAllStreams();
        }, this.CHECK_INTERVAL_MS);
    }
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            console.log("[StreamMonitor] Stream monitor stopped");
        }
    }
    async checkAllStreams() {
        try {
            // Get all social accounts
            const accounts = await db.socialAccount.findMany({
                include: {
                    guild: {
                        select: {
                            discordId: true,
                            socialNotificationsEnabled: true,
                            socialNotificationChannel: true,
                            socialNotificationRoles: true,
                            socialNotificationMessage: true,
                        },
                    },
                },
            });
            console.log(`[StreamMonitor] Checking ${accounts.length} accounts...`);
            for (const account of accounts) {
                // Skip if notifications are disabled for this guild
                if (!account.guild.socialNotificationsEnabled) {
                    continue;
                }
                // Skip if no notification channel is set
                if (!account.guild.socialNotificationChannel) {
                    continue;
                }
                try {
                    let streamData = null;
                    if (account.platform === "twitch") {
                        streamData = await this.checkTwitchStream(account.username);
                    }
                    else if (account.platform === "youtube") {
                        streamData = await this.checkYouTubeStream(account.username, account.userId);
                    }
                    if (!streamData) {
                        continue;
                    }
                    // Check if status changed
                    const wasLive = account.isLive;
                    const isNowLive = streamData.isLive;
                    // Update database
                    await db.socialAccount.update({
                        where: { id: account.id },
                        data: {
                            isLive: isNowLive,
                            lastChecked: new Date(),
                        },
                    });
                    // Send notification if just went live
                    if (!wasLive && isNowLive) {
                        await this.sendNotification(account, streamData);
                    }
                }
                catch (error) {
                    console.error(`[StreamMonitor] Error checking ${account.platform}/${account.username}:`, error);
                }
            }
        }
        catch (error) {
            console.error("[StreamMonitor] Error in checkAllStreams:", error);
        }
    }
    async checkTwitchStream(username) {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;
        console.log(`[StreamMonitor] 🔍 Checking Twitch user: "${username}"`);
        console.log(`[StreamMonitor] Client ID exists: ${!!clientId} (length: ${clientId?.length || 0})`);
        console.log(`[StreamMonitor] Client Secret exists: ${!!clientSecret} (length: ${clientSecret?.length || 0})`);
        if (!clientId || !clientSecret) {
            console.error("[StreamMonitor] ❌ Twitch credentials not configured");
            return null;
        }
        try {
            // Get OAuth token
            console.log("[StreamMonitor] 📡 Requesting Twitch OAuth token...");
            const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: "client_credentials",
                }),
            });
            if (!tokenResponse.ok) {
                const errorText = await tokenResponse.text();
                console.error(`[StreamMonitor] ❌ Failed to get Twitch token. Status: ${tokenResponse.status}`);
                console.error(`[StreamMonitor] Error response: ${errorText}`);
                return null;
            }
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;
            console.log(`[StreamMonitor] ✅ Got Twitch token (${accessToken.substring(0, 10)}...)`);
            // Get user info
            console.log(`[StreamMonitor] 📡 Fetching Twitch user info for: "${username}"`);
            const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
                headers: {
                    "Client-ID": clientId,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                console.error(`[StreamMonitor] ❌ Failed to get Twitch user: "${username}". Status: ${userResponse.status}`);
                console.error(`[StreamMonitor] Error response: ${errorText}`);
                return null;
            }
            const userData = await userResponse.json();
            console.log(`[StreamMonitor] Twitch API response:`, JSON.stringify(userData, null, 2));
            if (!userData.data || userData.data.length === 0) {
                console.error(`[StreamMonitor] ❌ Twitch user not found: "${username}"`);
                console.error(`[StreamMonitor] Make sure the username is correct (case-sensitive!)`);
                return null;
            }
            console.log(`[StreamMonitor] ✅ Found Twitch user: ${userData.data[0].display_name} (ID: ${userData.data[0].id})`);
            const userId = userData.data[0].id;
            // Check if live
            const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
                headers: {
                    "Client-ID": clientId,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!streamResponse.ok) {
                console.error(`[StreamMonitor] Failed to get Twitch stream: ${username}`);
                return null;
            }
            const streamData = await streamResponse.json();
            const isLive = streamData.data && streamData.data.length > 0;
            if (isLive) {
                const stream = streamData.data[0];
                return {
                    isLive: true,
                    title: stream.title,
                    viewerCount: stream.viewer_count,
                    thumbnailUrl: stream.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080"),
                    streamUrl: `https://twitch.tv/${username}`,
                };
            }
            return { isLive: false };
        }
        catch (error) {
            console.error(`[StreamMonitor] Error checking Twitch stream ${username}:`, error);
            return null;
        }
    }
    async checkYouTubeStream(channelName, channelId) {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            console.error("[StreamMonitor] YouTube API key not configured");
            return null;
        }
        try {
            let actualChannelId = channelId;
            // If we don't have the channel ID, search for it
            if (!actualChannelId) {
                const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelName)}&key=${apiKey}`);
                if (!searchResponse.ok) {
                    console.error(`[StreamMonitor] Failed to search YouTube channel: ${channelName}`);
                    return null;
                }
                const searchData = await searchResponse.json();
                if (!searchData.items || searchData.items.length === 0) {
                    console.error(`[StreamMonitor] YouTube channel not found: ${channelName}`);
                    return null;
                }
                actualChannelId = searchData.items[0].snippet.channelId;
                // Save the channel ID for future use
                await db.socialAccount.updateMany({
                    where: {
                        platform: "youtube",
                        username: channelName,
                    },
                    data: {
                        userId: actualChannelId,
                    },
                });
            }
            // Check for live streams
            const streamResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&eventType=live&type=video&key=${apiKey}`);
            if (!streamResponse.ok) {
                console.error(`[StreamMonitor] Failed to get YouTube stream: ${channelName}`);
                return null;
            }
            const streamData = await streamResponse.json();
            const isLive = streamData.items && streamData.items.length > 0;
            if (isLive) {
                const stream = streamData.items[0];
                const videoId = stream.id.videoId;
                // Get video details for viewer count
                const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoId}&key=${apiKey}`);
                let viewerCount = 0;
                if (videoResponse.ok) {
                    const videoData = await videoResponse.json();
                    if (videoData.items && videoData.items.length > 0) {
                        viewerCount = parseInt(videoData.items[0].liveStreamingDetails?.concurrentViewers || "0");
                    }
                }
                return {
                    isLive: true,
                    title: stream.snippet.title,
                    viewerCount,
                    thumbnailUrl: stream.snippet.thumbnails.high?.url || stream.snippet.thumbnails.default?.url,
                    streamUrl: `https://youtube.com/watch?v=${videoId}`,
                };
            }
            return { isLive: false };
        }
        catch (error) {
            console.error(`[StreamMonitor] Error checking YouTube stream ${channelName}:`, error);
            return null;
        }
    }
    async sendNotification(account, streamData) {
        try {
            const guild = await this.client.guilds.fetch(account.guild.discordId);
            if (!guild) {
                console.error(`[StreamMonitor] Guild not found: ${account.guild.discordId}`);
                return;
            }
            const channel = await guild.channels.fetch(account.guild.socialNotificationChannel);
            if (!channel || !(channel instanceof TextChannel)) {
                console.error(`[StreamMonitor] Channel not found or not a text channel: ${account.guild.socialNotificationChannel}`);
                return;
            }
            // Build role mentions
            let roleMentions = "";
            if (account.guild.socialNotificationRoles && account.guild.socialNotificationRoles.length > 0) {
                roleMentions = account.guild.socialNotificationRoles
                    .map((roleId) => `<@&${roleId}>`)
                    .join(" ");
            }
            // Build custom message
            let message = account.guild.socialNotificationMessage || "🔴 {user} is now live on {platform}!\n{url}";
            message = message
                .replace("{user}", account.username)
                .replace("{platform}", account.platform === "twitch" ? "Twitch" : "YouTube")
                .replace("{url}", streamData.streamUrl || "");
            // Create embed
            const embed = new EmbedBuilder()
                .setColor(account.platform === "twitch" ? 0x9146ff : 0xff0000)
                .setTitle(streamData.title || `${account.username} is live!`)
                .setURL(streamData.streamUrl || "")
                .setAuthor({
                name: account.username,
                iconURL: account.platform === "twitch"
                    ? "https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png"
                    : "https://www.youtube.com/s/desktop/d743f786/img/favicon_32x32.png",
            })
                .setDescription(`🔴 **LIVE** on ${account.platform === "twitch" ? "Twitch" : "YouTube"}`)
                .setTimestamp();
            if (streamData.viewerCount !== undefined) {
                embed.addFields({
                    name: "👥 Viewers",
                    value: streamData.viewerCount.toLocaleString(),
                    inline: true,
                });
            }
            if (streamData.thumbnailUrl) {
                embed.setImage(streamData.thumbnailUrl);
            }
            // Send notification
            await channel.send({
                content: roleMentions ? `${roleMentions}\n${message}` : message,
                embeds: [embed],
            });
            console.log(`[StreamMonitor] Sent notification for ${account.platform}/${account.username}`);
            // Log to audit
            await db.auditLog.create({
                data: {
                    guildId: account.guild.discordId,
                    action: "SOCIAL_NOTIFICATION_SENT",
                    userId: null,
                    userName: "System",
                    details: `Sent live notification for ${account.username} on ${account.platform}`,
                    metadata: {
                        platform: account.platform,
                        username: account.username,
                        title: streamData.title,
                        viewerCount: streamData.viewerCount,
                    },
                },
            });
        }
        catch (error) {
            console.error(`[StreamMonitor] Error sending notification:`, error);
        }
    }
}
