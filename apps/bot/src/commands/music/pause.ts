import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { db } from '@nexus/db';
import { useQueue } from 'discord-player';

export const data = new SlashCommandBuilder()
  .setName('pause')
  .setDescription('⏸️ Pause the current song.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;

  const guildSettings = await db.guild.findUnique({
    where: { discordId: interaction.guildId! },
  });

  if (!guildSettings?.musicEnabled) {
    return interaction.reply({
      embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ The Music module is disabled.')],
      ephemeral: true,
    });
  }

  if (guildSettings.djRoleIds.length > 0) {
    const hasDjRole = guildSettings.djRoleIds.some(id => member.roles.cache.has(id));
    if (!hasDjRole) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ You need a DJ role to pause.')],
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

  if (queue.node.isPaused()) {
    return interaction.reply({
      embeds: [new EmbedBuilder().setColor('#f97316').setDescription('⚠️ Already paused! Use `/resume` to resume.')],
      ephemeral: true,
    });
  }

  queue.node.pause();

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor('#f59e0b')
        .setDescription(`⏸️ **Paused:** [${queue.currentTrack.title}](${queue.currentTrack.url})\nUse \`/resume\` to continue.`),
    ],
  });
}
