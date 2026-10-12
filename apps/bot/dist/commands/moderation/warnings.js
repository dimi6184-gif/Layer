import { SlashCommandBuilder } from 'discord.js';
import { infoCV2 } from '../../utils/cv2.js';
import { warnStore } from './warn.js';
export const data = new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Shows warnings of a user.')
    .addUserOption((o) => o.setName('user').setDescription('User whose warnings you want to see.').setRequired(true));
export async function execute(interaction) {
    const target = interaction.options.getUser('user', true);
    const key = `${interaction.guild.id}-${target.id}`;
    const warns = warnStore.get(key) ?? [];
    const warnsText = warns.length === 0
        ? '✅ No warnings.'
        : warns.map((w, i) => `**${i + 1}.** ${w.reason}\n-# by ${w.by} • ${w.at.toLocaleDateString('en-US')}`).join('\n\n');
    await interaction.reply({
        ...infoCV2({
            title: `📋 Warnings — ${target.tag}`,
            thumbnail: target.displayAvatarURL({ size: 64 }),
            fields: [
                { label: 'Total', value: `${warns.length} Warning${warns.length !== 1 ? 's' : ''}` },
                { label: 'Log', value: warnsText },
            ],
        }),
        ephemeral: true,
    });
}
