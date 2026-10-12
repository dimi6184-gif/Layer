import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, PermissionFlagsBits, } from 'discord.js';
import { db } from '../../db.js';
export const data = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('🎫 Ticket system commands.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((sub) => sub
    .setName('panel')
    .setDescription('📩 Send the ticket panel to this channel.'))
    .addSubcommand((sub) => sub
    .setName('add')
    .setDescription('➕ Add a user to this ticket.')
    .addUserOption((opt) => opt.setName('user').setDescription('User to add').setRequired(true)))
    .addSubcommand((sub) => sub
    .setName('remove')
    .setDescription('➖ Remove a user from this ticket.')
    .addUserOption((opt) => opt.setName('user').setDescription('User to remove').setRequired(true)));
export async function execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'panel') {
        const settings = await db.guild.findUnique({
            where: { discordId: interaction.guildId },
        });
        if (!settings?.ticketsEnabled) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ef4444')
                        .setDescription('❌ The Ticket System is disabled. Enable it in the dashboard first.'),
                ],
                ephemeral: true,
            });
        }
        // ─── Defer ephemerally so "dimi used /ticket panel" is NEVER shown ──────
        await interaction.deferReply({ ephemeral: true });
        // Parse the stored hex color to a number Discord understands
        const colorHex = settings.ticketPanelColor || '#6366f1';
        const colorInt = parseInt(colorHex.replace('#', ''), 16) || 0x6366f1;
        let selectMenu;
        let button;
        // Check if dropdown mode is enabled and reasons are configured
        if (settings.ticketUseDropdown && settings.ticketReasons) {
            const reasons = settings.ticketReasons;
            if (reasons.length > 0) {
                selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('ticket:select_reason')
                    .setPlaceholder('Select a reason for your ticket')
                    .setMinValues(1)
                    .setMaxValues(1);
                // Add options from configured reasons
                for (const reason of reasons) {
                    selectMenu.addOptions({
                        label: reason.label,
                        value: reason.value,
                        emoji: reason.emoji || undefined,
                        description: reason.description || undefined,
                    });
                }
            }
            else {
                button = new ButtonBuilder()
                    .setCustomId('ticket:open')
                    .setLabel(settings.ticketButtonLabel || 'Open a Ticket')
                    .setEmoji(settings.ticketButtonEmoji || '🎫')
                    .setStyle(ButtonStyle.Primary);
            }
        }
        else {
            button = new ButtonBuilder()
                .setCustomId('ticket:open')
                .setLabel(settings.ticketButtonLabel || 'Open a Ticket')
                .setEmoji(settings.ticketButtonEmoji || '🎫')
                .setStyle(ButtonStyle.Primary);
        }
        const { buildTicketPanelCV2 } = await import('../../utils/cv2.js');
        const cv2Payload = buildTicketPanelCV2({
            title: settings.ticketPanelTitle || '🎫 Support Tickets',
            description: settings.ticketPanelDescription || 'Need help or have a question?\n\nClick the button below to open a **private support ticket**. Our team will be with you shortly.',
            accentColor: colorInt,
            selectMenu,
            button,
        });
        // Send directly to the channel with Components V2!
        await interaction.channel.send(cv2Payload);
        // Delete the ephemeral reply silently so nothing shows
        await interaction.deleteReply();
    }
    if (sub === 'add') {
        const channel = interaction.channel;
        if (!channel.name.startsWith('ticket-')) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ This command can only be used inside a ticket channel.')],
                ephemeral: true,
            });
        }
        const user = interaction.options.getUser('user', true);
        await channel.permissionOverwrites.create(user.id, { ViewChannel: true, SendMessages: true });
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#22c55e').setDescription(`✅ Added <@${user.id}> to the ticket.`)],
        });
    }
    if (sub === 'remove') {
        const channel = interaction.channel;
        if (!channel.name.startsWith('ticket-')) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ This command can only be used inside a ticket channel.')],
                ephemeral: true,
            });
        }
        const user = interaction.options.getUser('user', true);
        await channel.permissionOverwrites.delete(user.id);
        return interaction.reply({
            embeds: [new EmbedBuilder().setColor('#f97316').setDescription(`✅ Removed <@${user.id}> from the ticket.`)],
        });
    }
}
