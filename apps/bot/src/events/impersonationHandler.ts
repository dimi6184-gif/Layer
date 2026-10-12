import { GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ImpersonationDetector } from '../utils/impersonationDetector.js';

/**
 * Event Handler: Impersonation Detection
 * Checks new members for staff impersonation attempts
 */
export async function handleNewMember(member: GuildMember) {
  try {
    const { db } = await import('@nexus/db');
    
    // Check if guild has impersonation detection enabled
    const guildSettings = await db.guild.findUnique({
      where: { discordId: member.guild.id },
    });

    if (!guildSettings?.impersonationEnabled) {
      return;
    }

    console.log(`[Impersonation Detector] Checking ${member.user.tag} in ${member.guild.name}`);

    const results: any = await ImpersonationDetector.checkImpersonation(member);
    if (!results) return;

    // If HIGH risk and auto-action enabled, take action immediately
    if (results.riskLevel === 'HIGH' && guildSettings.impersonationAutoAction) {
      console.log(`[Impersonation Detector] 🚨 HIGH RISK detected! Taking action...`);

      const action = ((guildSettings as any).impersonationAutoAction || 'KICK').toUpperCase();

      if (action === 'KICK') {
        await member.kick(`Suspected staff impersonation: ${results.reason}`);
      } else if (action === 'BAN') {
        await member.ban({ reason: `Suspected staff impersonation: ${results.reason}` });
      }

      // Send alert to log channel
      if (guildSettings.logChannelId) {
        const logChannel = member.guild.channels.cache.get(guildSettings.logChannelId);
        if (logChannel && logChannel.isTextBased()) {
          const { EmbedBuilder } = await import('discord.js');
          
          const embed = new EmbedBuilder()
            .setColor('#dc2626')
            .setTitle('🚨 Impersonation Detected - Auto Action Taken')
            .setDescription(`**${member.user.tag}** was automatically ${action.toLowerCase()}ed for suspected staff impersonation.`)
            .addFields(
              { name: 'Risk Level', value: `🔴 **${results.riskLevel}**`, inline: true },
              { name: 'Similarity', value: `${results.similarity}%`, inline: true },
              { name: 'Action', value: action, inline: true },
              { name: 'Matched Staff', value: results.matchedStaffName || 'N/A', inline: true },
              { name: 'Reason', value: results.reason }
            )
            .setThumbnail(member.user.avatarURL({ size: 512 }) || member.user.defaultAvatarURL)
            .setFooter({ text: `User ID: ${member.user.id}` })
            .setTimestamp();

          logChannel.send({ embeds: [embed] }).catch(() => {});
        }
      }

      return;
    }

    // For MEDIUM/HIGH risk without auto-action, send alert only
    if (results.riskLevel === 'MEDIUM' || results.riskLevel === 'HIGH') {
      console.log(`[Impersonation Detector] ⚠️ ${results.riskLevel} RISK detected, sending alert...`);

      if (guildSettings.logChannelId) {
        const logChannel = member.guild.channels.cache.get(guildSettings.logChannelId);
        if (logChannel && logChannel.isTextBased()) {
          
          const riskColor = results.riskLevel === 'HIGH' ? '#dc2626' : '#f59e0b';
          const riskEmoji = results.riskLevel === 'HIGH' ? '🔴' : '🟠';
          
          const embed = new EmbedBuilder()
            .setColor(riskColor)
            .setTitle(`⚠️ Potential Impersonation Detected`)
            .setDescription(`**${member.user.tag}** joined and may be impersonating a staff member.`)
            .addFields(
              { name: 'Risk Level', value: `${riskEmoji} **${results.riskLevel}**`, inline: true },
              { name: 'Similarity', value: `${results.similarity}%`, inline: true },
              { name: 'User ID', value: member.user.id, inline: true },
              { name: 'Matched Staff', value: results.matchedStaffName || 'N/A', inline: true },
              { name: 'Reason', value: results.reason }
            )
            .setThumbnail(member.user.avatarURL({ size: 512 }) || member.user.defaultAvatarURL)
            .setFooter({ text: `Enable auto-action in dashboard to automatically handle impersonators` })
            .setTimestamp();

          const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`impersonation:kick:${member.user.id}`)
                .setLabel('Kick User')
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId(`impersonation:ban:${member.user.id}`)
                .setLabel('Ban User')
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId(`impersonation:ignore:${member.user.id}`)
                .setLabel('Ignore')
                .setStyle(ButtonStyle.Secondary)
            );

          logChannel.send({ embeds: [embed], components: [row] }).catch(() => {});
        }
      }
    }
  } catch (error) {
    console.error('[Impersonation Detector] Error checking new member:', error);
  }
}

/**
 * Handle button clicks for impersonation alerts
 */
export async function handleImpersonationButton(interaction: any) {
  if (!interaction.customId.startsWith('impersonation:')) return;

  const [, action, userId] = interaction.customId.split(':');

  try {
    const member = await interaction.guild.members.fetch(userId).catch(() => null);

    if (!member) {
      await interaction.reply({
        content: '❌ User has already left the server.',
        ephemeral: true,
      });
      return;
    }

    if (action === 'kick') {
      await member.kick('Staff impersonation - Manual action by moderator');
      await interaction.reply({
        content: `✅ Kicked ${member.user.tag} for suspected impersonation.`,
        ephemeral: true,
      });
    } else if (action === 'ban') {
      await member.ban({ reason: 'Staff impersonation - Manual action by moderator' });
      await interaction.reply({
        content: `✅ Banned ${member.user.tag} for suspected impersonation.`,
        ephemeral: true,
      });
    } else if (action === 'ignore') {
      await interaction.reply({
        content: `✅ Ignored impersonation alert for ${member.user.tag}.`,
        ephemeral: true,
      });
    }

    // Disable buttons after action
    await interaction.message.edit({ components: [] }).catch(() => {});
  } catch (error) {
    console.error('[Impersonation Button] Error:', error);
    await interaction.reply({
      content: '❌ Failed to perform action. Check bot permissions.',
      ephemeral: true,
    });
  }
}
