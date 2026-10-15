import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { dangerCV2 } from '../../utils/cv2.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Permanently bans a user from the server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption((o) => o.setName('user').setDescription('The user to ban.').setRequired(true))
  .addStringOption((o) => o.setName('reason').setDescription('Reason for the ban.'));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided.';

  if (target.id === interaction.user.id) return interaction.reply({ ...dangerCV2({ title: '❌ Cannot ban yourself' }), ephemeral: true });
  if (target.id === interaction.client.user?.id) return interaction.reply({ ...dangerCV2({ title: '❌ Cannot ban the bot' }), ephemeral: true });

  // Fetch member — cache may be empty after restarts or in large servers
  let member = interaction.guild!.members.cache.get(target.id);
  if (!member) {
    try { member = await interaction.guild!.members.fetch(target.id); } catch {}
  }

  if (!member) return interaction.reply({ ...dangerCV2({ title: '❌ User not found', description: 'This user is not on the server.' }), ephemeral: true });
  if (!member.bannable) return interaction.reply({ ...dangerCV2({ title: '❌ Permission Denied', description: 'I cannot ban this user.' }), ephemeral: true });

  // Try to DM the user before banning
  try {
    await target.send(dangerCV2({
      title: '🔨 You have been banned',
      description: `You were banned from **${interaction.guild!.name}**.`,
      fields: [
        { label: 'Reason', value: reason },
        { label: 'Moderator', value: interaction.user.tag }
      ]
    }));
  } catch (err) {
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
