// apps/bot/src/utils/avatarTracker.ts
import { PrismaClient } from '@prisma/client';
import { EmbedBuilder } from 'discord.js';
const prisma = new PrismaClient();
export class AvatarTracker {
    /**
     * Track avatar change for a user
     */
    static async trackAvatarChange(user, guild) {
        try {
            // Check if tracking is enabled
            const guildSettings = await prisma.guild.findUnique({
                where: { discordId: guild.id },
                select: {
                    avatarTrackingEnabled: true,
                    avatarHistoryLimit: true,
                    avatarLogChannelId: true,
                },
            });
            if (!guildSettings?.avatarTrackingEnabled) {
                return;
            }
            const avatarUrl = user.displayAvatarURL({ size: 512 });
            const avatarHash = user.avatar;
            // Check if this avatar is already the most recent one
            const latestAvatar = await prisma.avatarHistory.findFirst({
                where: {
                    userId: user.id,
                    guildId: guild.id,
                },
                orderBy: {
                    detectedAt: 'desc',
                },
            });
            // Don't store if it's the same avatar
            if (latestAvatar && latestAvatar.avatarHash === avatarHash) {
                return;
            }
            // Store new avatar
            await prisma.avatarHistory.create({
                data: {
                    userId: user.id,
                    guildId: guild.id,
                    username: user.username,
                    avatarUrl,
                    avatarHash,
                },
            });
            // Cleanup old avatars (keep only latest X)
            const limit = guildSettings.avatarHistoryLimit || 10;
            const allAvatars = await prisma.avatarHistory.findMany({
                where: {
                    userId: user.id,
                    guildId: guild.id,
                },
                orderBy: {
                    detectedAt: 'desc',
                },
            });
            if (allAvatars.length > limit) {
                const toDelete = allAvatars.slice(limit);
                await prisma.avatarHistory.deleteMany({
                    where: {
                        id: {
                            in: toDelete.map((a) => a.id),
                        },
                    },
                });
            }
            // Log to channel if configured
            if (guildSettings.avatarLogChannelId) {
                await this.logAvatarChange(guild, user, avatarUrl, guildSettings.avatarLogChannelId);
            }
        }
        catch (error) {
            console.error('[AvatarTracker] Error tracking avatar:', error);
        }
    }
    /**
     * Get avatar history for a user
     */
    static async getAvatarHistory(userId, guildId, limit = 10) {
        try {
            const history = await prisma.avatarHistory.findMany({
                where: {
                    userId,
                    guildId,
                },
                orderBy: {
                    detectedAt: 'desc',
                },
                take: limit,
                select: {
                    avatarUrl: true,
                    username: true,
                    detectedAt: true,
                },
            });
            return history;
        }
        catch (error) {
            console.error('[AvatarTracker] Error fetching history:', error);
            return [];
        }
    }
    /**
     * Log avatar change to channel
     */
    static async logAvatarChange(guild, user, newAvatarUrl, channelId) {
        try {
            const channel = guild.channels.cache.get(channelId);
            if (!channel)
                return;
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('👤 Avatar Changed')
                .setDescription(`**${user.username}** changed their profile picture`)
                .setThumbnail(newAvatarUrl)
                .addFields({ name: 'User', value: `<@${user.id}>`, inline: true }, { name: 'User ID', value: user.id, inline: true }, { name: 'Time', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true })
                .setTimestamp();
            await channel.send({ embeds: [embed] });
        }
        catch (error) {
            console.error('[AvatarTracker] Error logging to channel:', error);
        }
    }
    /**
     * Track avatar for a specific user manually
     */
    static async forceTrackUser(user, guild) {
        try {
            const avatarUrl = user.displayAvatarURL({ size: 512 });
            const avatarHash = user.avatar;
            await prisma.avatarHistory.create({
                data: {
                    userId: user.id,
                    guildId: guild.id,
                    username: user.username,
                    avatarUrl,
                    avatarHash,
                },
            });
            return true;
        }
        catch (error) {
            console.error('[AvatarTracker] Error force tracking:', error);
            return false;
        }
    }
    /**
     * Check if user recently changed avatar (within X hours)
     */
    static async hasRecentAvatarChange(userId, guildId, hoursAgo = 24) {
        try {
            const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
            const recentChange = await prisma.avatarHistory.findFirst({
                where: {
                    userId,
                    guildId,
                    detectedAt: {
                        gte: cutoff,
                    },
                },
            });
            return !!recentChange;
        }
        catch (error) {
            console.error('[AvatarTracker] Error checking recent change:', error);
            return false;
        }
    }
}
