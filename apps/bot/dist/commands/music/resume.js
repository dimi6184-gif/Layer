import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { db } from '../../db.js';
import { useQueue } from 'discord-player';
export const data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('▶️ Resume the paused song.');
export async function execute(interaction) {
    const member = interaction.member;
    const guildSettings = await db.guild.findUnique({
        where: { discordId: interaction.guildId },
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
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ You need a DJ role to resume.')],
                ephemeral: true,
            });
        }
    }
    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.currentTrack) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#f97316').setDescription('❌ Nothing is in the queue!')],
            ephemeral: true,
        });
    }
    if (!queue.node.isPaused()) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#f97316').setDescription('⚠️ Already playing! Use `/pause` to pause.')],
            ephemeral: true,
        });
    }
    queue.node.resume();
    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor('#22c55e')
                .setDescription(`▶️ **Resumed:** [${queue.currentTrack.title}](${queue.currentTrack.url})`),
        ],
    });
}
