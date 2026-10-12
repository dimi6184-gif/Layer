import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { dangerCV2 } from '../../utils/cv2.js';
export const data = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Permanently bans a user from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((o) => o.setName('user').setDescription('The user to ban.').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the ban.'));
export async function execute(interaction) {
    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided.';
    const member = interaction.guild.members.cache.get(target.id);
    if (!member)
        return interaction.reply({ ...dangerCV2({ title: '❌ User not found', description: 'This user is not on the server.' }), ephemeral: true });
    if (!member.bannable)
        return interaction.reply({ ...dangerCV2({ title: '❌ Permission Denied', description: 'I cannot ban this user.' }), ephemeral: true });
    // Try to DM the user before banning
    try {
        await target.send(dangerCV2({
            title: '🔨 You have been banned',
            description: `You were banned from **${interaction.guild.name}**.`,
            fields: [
                { label: 'Reason', value: reason },
                { label: 'Moderator', value: interaction.user.tag }
            ]
        }));
    }
    catch (err) {
        // Ignore if user has DMs disabled
    }
    await member.ban({ reason });
    await interaction.reply(dangerCV2({
        title: '🔨 User banned',
        thumbnail: target.displayAvatarURL({ size: 64 }),
        fields: [
            { label: 'User', value: `${target.tag} \`${target.id}\`` },
            { label: 'Moderator', value: interaction.user.tag },
            { label: 'Reason', value: reason },
        ],
    }));
}
