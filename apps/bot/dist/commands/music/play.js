import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getPlayer } from '../../player.js';
import { db } from '../../db.js';
export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('🎵 Play a song or playlist in your voice channel.')
    .addStringOption(option => option.setName('query')
    .setDescription('Song name, YouTube/Spotify/SoundCloud URL')
    .setRequired(true));
export async function execute(interaction) {
    const member = interaction.member;
    // Must be in a voice channel
    const voiceChannel = member.voice?.channel;
    if (!voiceChannel) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ **You must be in a voice channel first!**')],
            ephemeral: true,
        });
    }
    const guildSettings = await db.guild.findUnique({
        where: { discordId: interaction.guildId },
    });
    if (!guildSettings?.musicEnabled) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ **The Music module is disabled on this server.**\nAn admin can enable it in the dashboard.')],
            ephemeral: true,
        });
    }
    // DJ Role check
    if (guildSettings.djRoleIds.length > 0) {
        const hasDjRole = guildSettings.djRoleIds.some(roleId => member.roles.cache.has(roleId));
        if (!hasDjRole) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ **You need a DJ role to use music commands.**')],
                ephemeral: true,
            });
        }
    }
    const player = getPlayer();
    if (!player) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ **Music player is still starting up, try again in a moment.**')],
            ephemeral: true,
        });
    }
    const query = interaction.options.getString('query', true);
    await interaction.deferReply();
    try {
        const { track } = await player.play(voiceChannel, query, {
            nodeOptions: {
                metadata: {
                    channelId: interaction.channelId,
                },
                selfDeaf: true,
                volume: 80,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 10000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 30000,
            },
            requestedBy: interaction.user,
            searchEngine: 'soundcloud',
        });
        const embed = new EmbedBuilder()
            .setColor('#8b5cf6')
            .setDescription(`🎵 **Queued:** [${track.title}](${track.url})\n⏱️ Duration: \`${track.duration}\``)
            .setThumbnail(track.thumbnail)
            .setFooter({ text: `Requested by ${interaction.user.username}` });
        return interaction.followUp({ embeds: [embed] });
    }
    catch (e) {
        console.error('[/play error]', e);
        return interaction.followUp({
            embeds: [new EmbedBuilder().setColor('#ef4444').setDescription(`❌ **Could not play:** ${e?.message ?? 'Unknown error'}\n\nTry a direct YouTube/SoundCloud URL.`)],
        });
    }
}
