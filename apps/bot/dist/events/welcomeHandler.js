import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { db } from '../db.js';
import { createCanvas, loadImage } from 'canvas';
export async function handleMemberJoin(member) {
    try {
        const settings = await db.guild.findUnique({
            where: { discordId: member.guild.id },
            select: {
                welcomeEnabled: true,
                welcomeChannelId: true,
                welcomeMessage: true,
                welcomeEmbedEnabled: true,
                welcomeEmbedTitle: true,
                welcomeEmbedDescription: true,
                welcomeEmbedColor: true,
                welcomeImageEnabled: true,
                welcomeImageConfig: true,
                welcomeDMEnabled: true,
                welcomeDMMessage: true,
                autoRoleIds: true,
            },
        });
        if (!settings?.welcomeEnabled)
            return;
        const memberCount = member.guild.memberCount;
        // Replace placeholders
        const replacePlaceholders = (text) => {
            return text
                .replace(/{user}/g, `<@${member.id}>`)
                .replace(/{username}/g, member.user.username)
                .replace(/{server}/g, member.guild.name)
                .replace(/{memberCount}/g, memberCount.toString());
        };
        // Auto-assign roles
        if (settings.autoRoleIds && settings.autoRoleIds.length > 0) {
            for (const roleId of settings.autoRoleIds) {
                try {
                    await member.roles.add(roleId);
                    console.log(`[Welcome] Auto-assigned role ${roleId} to ${member.user.tag}`);
                }
                catch (error) {
                    console.error(`[Welcome] Failed to assign role ${roleId}:`, error);
                }
            }
        }
        // Send welcome message to channel
        if (settings.welcomeChannelId) {
            try {
                const channel = await member.guild.channels.fetch(settings.welcomeChannelId);
                if (!channel?.isTextBased())
                    return;
                const messageOptions = {};
                // Generate welcome image if enabled
                if (settings.welcomeImageEnabled) {
                    try {
                        const image = await generateWelcomeImage(member, memberCount, settings.welcomeImageConfig);
                        messageOptions.files = [new AttachmentBuilder(image, { name: 'welcome.png' })];
                    }
                    catch (error) {
                        console.error('[Welcome] Failed to generate image:', error);
                    }
                }
                // Create embed if enabled
                if (settings.welcomeEmbedEnabled) {
                    const embed = new EmbedBuilder()
                        .setColor(parseInt(settings.welcomeEmbedColor?.replace('#', '') || '5865F2', 16))
                        .setTitle(replacePlaceholders(settings.welcomeEmbedTitle))
                        .setDescription(replacePlaceholders(settings.welcomeEmbedDescription))
                        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
                        .setTimestamp();
                    if (settings.welcomeImageEnabled && messageOptions.files) {
                        embed.setImage('attachment://welcome.png');
                    }
                    messageOptions.embeds = [embed];
                }
                // Custom message (without embed)
                if (settings.welcomeMessage && !settings.welcomeEmbedEnabled) {
                    messageOptions.content = replacePlaceholders(settings.welcomeMessage);
                }
                await channel.send(messageOptions);
                console.log(`[Welcome] Sent welcome message for ${member.user.tag}`);
            }
            catch (error) {
                console.error('[Welcome] Failed to send welcome message:', error);
            }
        }
        // Send DM if enabled
        if (settings.welcomeDMEnabled && settings.welcomeDMMessage) {
            try {
                await member.send(replacePlaceholders(settings.welcomeDMMessage));
                console.log(`[Welcome] Sent DM to ${member.user.tag}`);
            }
            catch (error) {
                console.error('[Welcome] Failed to send DM:', error);
            }
        }
        // Audit log
        await db.auditLog.create({
            data: {
                guildId: member.guild.id,
                action: 'MEMBER_JOINED',
                userId: member.id,
                userName: member.user.tag,
                details: `${member.user.tag} joined the server`,
                metadata: { memberCount },
            },
        });
    }
    catch (error) {
        console.error('[Welcome] Error handling member join:', error);
    }
}
export async function handleMemberLeave(member) {
    try {
        const settings = await db.guild.findUnique({
            where: { discordId: member.guild.id },
            select: {
                leaveEnabled: true,
                leaveChannelId: true,
                leaveMessage: true,
                leaveEmbedEnabled: true,
                leaveEmbedTitle: true,
                leaveEmbedDescription: true,
                leaveEmbedColor: true,
            },
        });
        if (!settings?.leaveEnabled || !settings.leaveChannelId)
            return;
        const memberCount = member.guild.memberCount;
        // Replace placeholders
        const replacePlaceholders = (text) => {
            return text
                .replace(/{user}/g, member.user.tag)
                .replace(/{username}/g, member.user.username)
                .replace(/{server}/g, member.guild.name)
                .replace(/{memberCount}/g, memberCount.toString());
        };
        try {
            const channel = await member.guild.channels.fetch(settings.leaveChannelId);
            if (!channel?.isTextBased())
                return;
            const messageOptions = {};
            // Create embed if enabled
            if (settings.leaveEmbedEnabled) {
                const embed = new EmbedBuilder()
                    .setColor(parseInt(settings.leaveEmbedColor?.replace('#', '') || 'ef4444', 16))
                    .setTitle(replacePlaceholders(settings.leaveEmbedTitle))
                    .setDescription(replacePlaceholders(settings.leaveEmbedDescription))
                    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
                    .setTimestamp();
                messageOptions.embeds = [embed];
            }
            // Custom message (without embed)
            if (settings.leaveMessage && !settings.leaveEmbedEnabled) {
                messageOptions.content = replacePlaceholders(settings.leaveMessage);
            }
            await channel.send(messageOptions);
            console.log(`[Leave] Sent leave message for ${member.user.tag}`);
        }
        catch (error) {
            console.error('[Leave] Failed to send leave message:', error);
        }
        // Audit log
        await db.auditLog.create({
            data: {
                guildId: member.guild.id,
                action: 'MEMBER_LEFT',
                userId: member.id,
                userName: member.user.tag,
                details: `${member.user.tag} left the server`,
                metadata: { memberCount },
            },
        });
    }
    catch (error) {
        console.error('[Leave] Error handling member leave:', error);
    }
}
const defaultImageConfig = {
    welcomeEnabled: true,
    usernameEnabled: true,
    memberCountEnabled: true,
    serverNameEnabled: true,
    backgroundType: 'gradient',
    backgroundColor: '#5865F2',
    gradientStart: '#5865F2',
    gradientEnd: '#7289DA',
    gradientDirection: 'diagonal',
    avatarSize: 120,
    avatarX: 80,
    avatarBorderColor: '#FFFFFF',
    avatarBorderWidth: 5,
    welcomeText: 'WELCOME',
    welcomeSize: 48,
    welcomeColor: '#FFFFFF',
    welcomeFont: 'Arial',
    welcomeX: 220,
    welcomeY: 110,
    usernameSize: 36,
    usernameColor: '#FFFFFF',
    usernameFont: 'Arial',
    usernameX: 220,
    usernameY: 160,
    memberCountSize: 24,
    memberCountColor: '#CCCCCC',
    memberCountFont: 'Arial',
    memberCountX: 220,
    memberCountY: 200,
    serverNameSize: 24,
    serverNameColor: '#CCCCCC',
    serverNameFont: 'Arial',
    serverNameX: 220,
    serverNameY: 240,
};
async function generateWelcomeImage(member, memberCount, customConfig) {
    // Merge custom config with defaults
    const config = { ...defaultImageConfig, ...customConfig };
    // Canvas size
    const width = 800;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    // Draw background
    if (config.backgroundType === 'image' && config.backgroundImageUrl) {
        try {
            const bgImage = await loadImage(config.backgroundImageUrl);
            const fit = config.backgroundImageFit || 'cover';
            if (fit === 'stretch') {
                ctx.drawImage(bgImage, 0, 0, width, height);
            }
            else if (fit === 'contain') {
                const scale = Math.min(width / bgImage.width, height / bgImage.height);
                const scaledWidth = bgImage.width * scale;
                const scaledHeight = bgImage.height * scale;
                const x = (width - scaledWidth) / 2;
                const y = (height - scaledHeight) / 2;
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(bgImage, x, y, scaledWidth, scaledHeight);
            }
            else {
                const scale = Math.max(width / bgImage.width, height / bgImage.height);
                const scaledWidth = bgImage.width * scale;
                const scaledHeight = bgImage.height * scale;
                const x = (width - scaledWidth) / 2;
                const y = (height - scaledHeight) / 2;
                ctx.drawImage(bgImage, x, y, scaledWidth, scaledHeight);
            }
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, width, height);
        }
        catch (error) {
            console.error('[Welcome] Failed to load background image:', error);
            // Fallback to gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, config.gradientStart);
            gradient.addColorStop(1, config.gradientEnd);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, width, height);
        }
    }
    else if (config.backgroundType === 'gradient') {
        let gradient;
        if (config.gradientDirection === 'horizontal') {
            gradient = ctx.createLinearGradient(0, 0, width, 0);
        }
        else if (config.gradientDirection === 'vertical') {
            gradient = ctx.createLinearGradient(0, 0, 0, height);
        }
        else {
            gradient = ctx.createLinearGradient(0, 0, width, height);
        }
        gradient.addColorStop(0, config.gradientStart);
        gradient.addColorStop(1, config.gradientEnd);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);
    }
    else {
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);
    }
    // Load avatar
    try {
        const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 256 }));
        // Draw circular avatar
        const avatarY = height / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(config.avatarX, avatarY, config.avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, config.avatarX - config.avatarSize / 2, avatarY - config.avatarSize / 2, config.avatarSize, config.avatarSize);
        ctx.restore();
        // Avatar border
        if (config.avatarBorderWidth > 0) {
            ctx.strokeStyle = config.avatarBorderColor;
            ctx.lineWidth = config.avatarBorderWidth;
            ctx.beginPath();
            ctx.arc(config.avatarX, avatarY, config.avatarSize / 2, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    catch (error) {
        console.error('[Welcome] Failed to load avatar:', error);
    }
    // Welcome text
    if (config.welcomeEnabled) {
        ctx.fillStyle = config.welcomeColor;
        ctx.font = `bold ${config.welcomeSize}px ${config.welcomeFont || 'Arial'}`;
        ctx.textAlign = 'left';
        ctx.fillText(config.welcomeText, config.welcomeX, config.welcomeY);
    }
    // Username
    if (config.usernameEnabled) {
        ctx.fillStyle = config.usernameColor;
        ctx.font = `bold ${config.usernameSize}px ${config.usernameFont || 'Arial'}`;
        const username = member.user.username;
        const displayName = username.length > 20 ? username.substring(0, 17) + '...' : username;
        ctx.fillText(displayName, config.usernameX, config.usernameY);
    }
    // Member count
    if (config.memberCountEnabled) {
        ctx.fillStyle = config.memberCountColor;
        ctx.font = `${config.memberCountSize}px ${config.memberCountFont || 'Arial'}`;
        ctx.fillText(`You are member #${memberCount}`, config.memberCountX, config.memberCountY);
    }
    // Server name
    if (config.serverNameEnabled) {
        ctx.fillStyle = config.serverNameColor;
        ctx.font = `${config.serverNameSize}px ${config.serverNameFont || 'Arial'}`;
        const serverName = member.guild.name;
        const displayServerName = serverName.length > 30 ? serverName.substring(0, 27) + '...' : serverName;
        ctx.fillText(displayServerName, config.serverNameX, config.serverNameY);
    }
    return canvas.toBuffer('image/png');
}
