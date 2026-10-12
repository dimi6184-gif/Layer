import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { db } from '../../db.js';
import { useQueue } from 'discord-player';
export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('🛑 Stop the music and clear the queue.');
export async function execute(interaction) {
    const member = interaction.member;
    const guildSettings = await db.guild.findUnique({
        where: { discordId: interaction.guildId },
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
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ You need a DJ role to stop the music.')],
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
    queue.delete();
    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor('#ef4444')
                .setDescription('🛑 **Stopped** the music and cleared the queue.'),
        ],
    });
}
