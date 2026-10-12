import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, } from 'discord.js';
import { db } from '@nexus/db';
// Store CAPTCHA codes temporarily (in production, use Redis)
const captchaCodes = new Map();
// Clean expired codes every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of captchaCodes.entries()) {
        if (value.expires < now) {
            captchaCodes.delete(key);
        }
    }
}, 5 * 60 * 1000);
export async function handleVerificationButton(interaction) {
    // Check if user is already verified
    const guild = await db.guild.findUnique({
        where: { discordId: interaction.guildId },
        select: {
            verificationEnabled: true,
            verificationRoleId: true,
            verificationCaptchaEnabled: true,
            verificationLogChannelId: true,
        },
    });
    if (!guild?.verificationEnabled) {
        await interaction.reply({
            content: '❌ Verification is currently disabled.',
            flags: 64, // Ephemeral flag
        });
        return;
    }
    if (!guild.verificationRoleId) {
        await interaction.reply({
            content: '❌ Verification role not configured.',
            flags: 64, // Ephemeral flag
        });
        return;
    }
    const member = interaction.member;
    if (member.roles.cache.has(guild.verificationRoleId)) {
        await interaction.reply({
            content: '✅ You are already verified!',
            flags: 64, // Ephemeral flag
        });
        return;
    }
    // If CAPTCHA is enabled, show modal
    if (guild.verificationCaptchaEnabled) {
        // Generate CAPTCHA code
        const code = generateCaptchaCode();
        const key = `${interaction.guildId}-${interaction.user.id}`;
        captchaCodes.set(key, {
            code,
            expires: Date.now() + 5 * 60 * 1000, // 5 minutes
        });
        // Create modal
        const modal = new ModalBuilder()
            .setCustomId('verification:captcha')
            .setTitle('Verification - CAPTCHA');
        const captchaInput = new TextInputBuilder()
            .setCustomId('captcha_code')
            .setLabel(`Enter this code: ${code}`)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the code above')
            .setRequired(true)
            .setMinLength(6)
            .setMaxLength(6);
        const row = new ActionRowBuilder().addComponents(captchaInput);
        modal.addComponents(row);
        await interaction.showModal(modal);
    }
    else {
        // No CAPTCHA, verify immediately
        await verifyMember(interaction, guild.verificationRoleId, guild.verificationLogChannelId);
    }
}
export async function handleVerificationModal(interaction) {
    await interaction.deferReply({ flags: 64 }); // Ephemeral flag
    const key = `${interaction.guildId}-${interaction.user.id}`;
    const stored = captchaCodes.get(key);
    if (!stored) {
        await interaction.editReply('❌ CAPTCHA expired. Please try again.');
        return;
    }
    const userCode = interaction.fields.getTextInputValue('captcha_code').toUpperCase();
    if (userCode !== stored.code) {
        await interaction.editReply('❌ Incorrect code! Please try again.');
        return;
    }
    // Remove used code
    captchaCodes.delete(key);
    // Get guild settings
    const guild = await db.guild.findUnique({
        where: { discordId: interaction.guildId },
        select: {
            verificationRoleId: true,
            verificationLogChannelId: true,
        },
    });
    if (!guild?.verificationRoleId) {
        await interaction.editReply('❌ Verification role not configured.');
        return;
    }
    await verifyMember(interaction, guild.verificationRoleId, guild.verificationLogChannelId);
}
async function verifyMember(interaction, roleId, logChannelId) {
    const member = interaction.member;
    try {
        await member.roles.add(roleId);
        // Reply based on interaction type and state
        const successMessage = '✅ **Verification successful!**\n\nYou now have access to the server. Welcome!';
        if (interaction.deferred || interaction.replied) {
            // Already deferred or replied, use editReply
            await interaction.editReply(successMessage);
        }
        else {
            // Not yet replied, use reply
            await interaction.reply({
                content: successMessage,
                flags: 64, // Ephemeral flag
            });
        }
        // Log to audit
        await db.auditLog.create({
            data: {
                guildId: interaction.guildId,
                action: 'USER_VERIFIED',
                userId: interaction.user.id,
                userName: interaction.user.tag,
                details: `${interaction.user.tag} verified successfully`,
                metadata: { roleId },
            },
        });
        // Log to channel if configured
        if (logChannelId) {
            try {
                const logChannel = await interaction.guild?.channels.fetch(logChannelId);
                if (logChannel?.isTextBased()) {
                    const embed = new EmbedBuilder()
                        .setColor(0x10b981)
                        .setTitle('✅ User Verified')
                        .setDescription(`${interaction.user} has been verified`)
                        .addFields({ name: 'User', value: `${interaction.user.tag}`, inline: true }, { name: 'User ID', value: interaction.user.id, inline: true })
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] });
                }
            }
            catch (error) {
                console.error('[Verification] Failed to log to channel:', error);
            }
        }
    }
    catch (error) {
        console.error('[Verification] Error adding role:', error);
        const errorMsg = '❌ Failed to verify. Please contact an administrator.';
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply(errorMsg);
            }
            else {
                await interaction.reply({
                    content: errorMsg,
                    flags: 64, // Ephemeral flag
                });
            }
        }
        catch (replyError) {
            console.error('[Verification] Error sending error message:', replyError);
        }
    }
}
function generateCaptchaCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
