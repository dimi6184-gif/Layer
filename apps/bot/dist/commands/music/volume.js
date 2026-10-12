import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { db } from '../../db.js';
import { useQueue } from 'discord-player';
export const data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('🔊 Change the music volume.')
    .addIntegerOption(opt => opt.setName('level')
    .setDescription('Volume level (0-100)')
    .setRequired(true)
    .setMinValue(0)
    .setMaxValue(100));
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
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ You need a DJ role to change volume.')],
                ephemeral: true,
            });
        }
    }
    const queue = useQueue(interaction.guildId);
    if (!queue) {
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#f97316').setDescription('❌ Nothing is currently playing!')],
            ephemeral: true,
        });
    }
    const vol = interaction.options.getInteger('level', true);
    queue.node.setVolume(vol);
    const bar = '█'.repeat(Math.round(vol / 10)) + '░'.repeat(10 - Math.round(vol / 10));
    const emoji = vol === 0 ? '🔇' : vol < 30 ? '🔈' : vol < 70 ? '🔉' : '🔊';
    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor('#8b5cf6')
                .setDescription(`${emoji} **Volume set to ${vol}%**\n\`${bar}\``),
        ],
    });
}
