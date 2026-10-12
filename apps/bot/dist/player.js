import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { EmbedBuilder } from 'discord.js';
let player = null;
export async function setupPlayer(client) {
    player = new Player(client, {
        skipFFmpeg: false,
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
        },
    });
    // Load all default extractors
    await player.extractors.loadMulti(DefaultExtractors);
    // Register YouTubei extractor which bypasses YouTube blocks using youtube-dl-exec
    try {
        await player.extractors.register(YoutubeiExtractor, {
            authentication: "" // Optional token if you have one, but usually works without
        });
    }
    catch (e) {
        console.error("Failed to load YoutubeiExtractor:", e);
    }
    // ── Events ──────────────────────────────────────────────────────────────────
    player.events.on('playerStart', (queue, track) => {
        const meta = queue.metadata;
        if (!meta?.channelId)
            return;
        const channel = client.channels.cache.get(meta.channelId);
        if (!channel)
            return;
        const embed = new EmbedBuilder()
            .setColor('#3b82f6')
            .setAuthor({ name: '🎵 Now Playing' })
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .addFields({ name: 'Duration', value: track.duration, inline: true }, { name: 'Author', value: track.author || 'Unknown', inline: true }, { name: 'Requested by', value: track.requestedBy?.toString() ?? 'Unknown', inline: true })
            .setFooter({ text: `Queue: ${queue.tracks.size} track(s) remaining` });
        channel.send({ embeds: [embed] }).catch(() => { });
    });
    player.events.on('audioTrackAdd', (queue, track) => {
        // Only announce if something is already playing (i.e., it's queued, not the first track)
        if (queue.currentTrack) {
            const meta = queue.metadata;
            if (!meta?.channelId)
                return;
            const channel = client.channels.cache.get(meta.channelId);
            if (!channel)
                return;
            const embed = new EmbedBuilder()
                .setColor('#8b5cf6')
                .setDescription(`🎶 **Added to queue:** [${track.title}](${track.url})\n⏱️ Duration: \`${track.duration}\``);
            channel.send({ embeds: [embed] }).catch(() => { });
        }
    });
    player.events.on('emptyQueue', (queue) => {
        const meta = queue.metadata;
        if (!meta?.channelId)
            return;
        const channel = client.channels.cache.get(meta.channelId);
        if (!channel)
            return;
        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#6b7280')
                    .setDescription('✅ Queue finished. Disconnecting from voice channel.'),
            ],
        }).catch(() => { });
    });
    player.events.on('error', (queue, error) => {
        console.error('[Music Player] Error:', error.message);
        const meta = queue.metadata;
        if (!meta?.channelId)
            return;
        const channel = client.channels.cache.get(meta.channelId);
        channel?.send({ content: `❌ Music error: ${error.message}` }).catch(() => { });
    });
    player.events.on('playerError', (queue, error) => {
        console.error('[Music Player] Player error:', error.message);
        const meta = queue.metadata;
        if (!meta?.channelId)
            return;
        const channel = client.channels.cache.get(meta.channelId);
        channel?.send({ content: `❌ Player error: ${error.message}` }).catch(() => { });
    });
    console.log('   🎵 Music Player ready with', player.extractors.size, 'extractors');
    return player;
}
export function getPlayer() {
    return player;
}
