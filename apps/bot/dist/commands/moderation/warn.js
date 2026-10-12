import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { warnCV2 } from '../../utils/cv2.js';
export const warnStore = new Map();
export const data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user and logs it.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) => o.setName('user').setDescription('User to warn.').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the warning.').setRequired(true));
export async function execute(interaction) {
    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', true);
    const key = `${interaction.guild.id}-${target.id}`;
    const warns = warnStore.get(key) ?? [];
    warns.push({ reason, by: interaction.user.tag, at: new Date() });
    warnStore.set(key, warns);
    // Try to DM the user
    try {
        await target.send(warnCV2({
            title: '⚠️ You received a warning',
            description: `You were warned in **${interaction.guild.name}**.`,
            fields: [
                { label: 'Reason', value: reason },
                { label: 'Moderator', value: interaction.user.tag }
            ]
        }));
    }
    catch (err) {
        // Ignore if user has DMs disabled
    }
    await interaction.reply(warnCV2({
        title: '⚠️ User warned',
        thumbnail: target.displayAvatarURL({ size: 64 }),
        fields: [
            { label: 'User', value: `${target.tag} \`${target.id}\`` },
            { label: 'Total Warnings', value: `${warns.length}` },
            { label: 'Moderator', value: interaction.user.tag },
            { label: 'Reason', value: reason },
        ],
    }));
}
