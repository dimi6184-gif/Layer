import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { db } from '../../db.js';
import { useQueue } from 'discord-player';
export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('📋 Show the current music queue.');
export async function execute(interaction) {
    const guildSettings = await db.guild.findUnique({
        where: { discordId: interaction.guildId },
    });
    if (!guildSettings?.musicEnabled) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ The Music module is disabled.')],
            ephemeral: true,
        });
    }
    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.currentTrack) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#f97316').setDescription('❌ Nothing is currently playing!')],
            ephemeral: true,
        });
    }
    const current = queue.currentTrack;
    const tracks = queue.tracks.toArray().slice(0, 10);
    const embed = new EmbedBuilder()
        .setColor('#3b82f6')
        .setTitle('📋 Music Queue')
        .addFields({
        name: '🎵 Now Playing',
        value: `[${current.title}](${current.url}) — \`${current.duration}\` — ${current.requestedBy}`,
    });
    if (tracks.length > 0) {
        const queueList = tracks
            .map((t, i) => `**${i + 1}.** [${t.title}](${t.url}) — \`${t.duration}\``)
            .join('\n');
        embed.addFields({
            name: `📑 Up Next (${queue.tracks.size} total)`,
            value: queueList,
        });
    }
    return interaction.reply({ embeds: [embed] });
}
