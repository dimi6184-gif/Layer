import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { db } from '@nexus/db';
import { useQueue } from 'discord-player';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('⏭️ Skip the current song.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;

  const guildSettings = await db.guild.findUnique({
    where: { discordId: interaction.guildId! },
  });

  if (!guildSettings?.musicEnabled) {
    return interaction.reply({
      embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ The Music module is disabled on this server.')],
      ephemeral: true,
    });
  }

  if (guildSettings.djRoleIds.length > 0) {
    const hasDjRole = guildSettings.djRoleIds.some(id => member.roles.cache.has(id));
    if (!hasDjRole) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ You need a DJ role to skip tracks.')],
        ephemeral: true,
      });
    }
  }

  const queue = useQueue(interaction.guildId!);
  if (!queue || !queue.currentTrack) {
    return interaction.reply({
      embeds: [new EmbedBuilder().setColor('#f97316').setDescription('❌ Nothing is currently playing!')],
      ephemeral: true,
    });
  }

  const skipped = queue.currentTrack;
  queue.node.skip();

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor('#3b82f6')
        .setDescription(`⏭️ **Skipped:** [${skipped.title}](${skipped.url})`),
    ],
  });
}
