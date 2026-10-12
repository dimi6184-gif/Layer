import { EmbedBuilder, ChannelType, PermissionFlagsBits, OverwriteType, } from 'discord.js';
import { db } from '../db.js';
import { createTranscript } from 'discord-html-transcripts';
// Map to track open tickets per user per guild
const openTickets = new Map(); // key: `${guildId}:${userId}` => channelId
export async function handleTicketButton(interaction) {
    const { customId, guild, user, guildId } = interaction;
    if (!guild || !guildId)
        return;
    // ── Select Menu (Dropdown) ──────────────────────────────────────────────────
    if (customId === 'ticket:select_reason' && interaction.isStringSelectMenu()) {
        const selectedReason = interaction.values[0];
        const settings = await db.guild.findUnique({
            where: { discordId: guildId },
        });
        if (!settings?.ticketsEnabled) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ Tickets are currently disabled.')],
                ephemeral: true,
            });
        }
        // Get the reason details
        const reasons = settings.ticketReasons;
        const reasonData = reasons?.find(r => r.value === selectedReason);
        const reasonLabel = reasonData?.label || selectedReason;
        // Check if user already has an open ticket
        const ticketKey = `${guildId}:${user.id}`;
        const existingChannelId = openTickets.get(ticketKey);
        if (existingChannelId) {
            const existing = guild.channels.cache.get(existingChannelId);
            if (existing) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#f97316')
                            .setDescription(`❌ You already have an open ticket: <#${existingChannelId}>`),
                    ],
                    ephemeral: true,
                });
            }
            openTickets.delete(ticketKey);
        }
        await interaction.deferReply({ ephemeral: true });
        try {
            // Build permission overwrites
            const overwrites = [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                    type: OverwriteType.Role,
                },
                {
                    id: user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    type: OverwriteType.Member,
                },
            ];
            // Add support roles
            for (const roleId of settings.ticketSupportRoleIds) {
                overwrites.push({
                    id: roleId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages],
                    type: OverwriteType.Role,
                });
            }
            // Create the ticket channel
            const ticketNumber = Date.now().toString().slice(-5);
            const ticketChannel = await guild.channels.create({
                name: `ticket-${selectedReason}-${ticketNumber}`,
                type: ChannelType.GuildText,
                parent: settings.ticketCategoryId || undefined,
                permissionOverwrites: overwrites,
                topic: `${reasonLabel} | User: ${user.tag} (${user.id})`,
            });
            openTickets.set(ticketKey, ticketChannel.id);
            // Create ticket analytics entry
            await db.ticketAnalytics.create({
                data: {
                    guildId,
                    ticketId: ticketChannel.id,
                    userId: user.id,
                    userName: user.tag,
                    category: reasonLabel,
                    aiHandled: false,
                    aiResolved: false,
                    escalated: false,
                    messageCount: 0,
                    aiMessageCount: 0,
                },
            }).catch(() => { });
            // Send welcome message in ticket using Components V2
            const colorHex = settings.ticketPanelColor || '#6366f1';
            const colorInt = parseInt(colorHex.replace('#', ''), 16) || 0x6366f1;
            const { buildTicketWelcomeCV2 } = await import('../utils/cv2.js');
            const welcomePayload = buildTicketWelcomeCV2({
                reason: reasonLabel,
                userMention: `<@${user.id}>`,
                creatorTag: user.tag,
                accentColor: colorInt,
                closeCustomId: `ticket:close:${user.id}`,
            });
            const mentionLine = settings.ticketSupportRoleIds.length > 0
                ? settings.ticketSupportRoleIds.map(id => `<@&${id}>`).join(' ')
                : '';
            await ticketChannel.send({
                content: mentionLine || undefined,
                ...welcomePayload,
            });
            // Record welcome message in ticket history
            await db.ticketMessage.create({
                data: {
                    guildId,
                    ticketId: ticketChannel.id,
                    userId: guild.client.user?.id || 'system',
                    userName: '🤖 Ticket System',
                    content: `🎫 **Ticket opened** by ${user.tag} for **${reasonLabel}**.\nSupport will be with you shortly.`,
                    isAI: false,
                },
            }).catch(() => { });
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#22c55e')
                        .setDescription(`✅ Your ticket has been created: <#${ticketChannel.id}>`),
                ],
            });
        }
        catch (err) {
            console.error('[Ticket Open Error]', err);
            await interaction.editReply({
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ Failed to create ticket. Check bot permissions.')],
            });
        }
        return;
    }
    // ── Open Ticket (Button) ──────────────────────────────────────────────────────────────
    if (customId === 'ticket:open' && interaction.isButton()) {
        const settings = await db.guild.findUnique({
            where: { discordId: guildId },
        });
        if (!settings?.ticketsEnabled) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ Tickets are currently disabled.')],
                ephemeral: true,
            });
        }
        // Check if user already has an open ticket
        const ticketKey = `${guildId}:${user.id}`;
        const existingChannelId = openTickets.get(ticketKey);
        if (existingChannelId) {
            const existing = guild.channels.cache.get(existingChannelId);
            if (existing) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#f97316')
                            .setDescription(`❌ You already have an open ticket: <#${existingChannelId}>`),
                    ],
                    ephemeral: true,
                });
            }
            openTickets.delete(ticketKey);
        }
        await interaction.deferReply({ ephemeral: true });
        try {
            // Build permission overwrites
            const overwrites = [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                    type: OverwriteType.Role,
                },
                {
                    id: user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    type: OverwriteType.Member,
                },
            ];
            // Add support roles
            for (const roleId of settings.ticketSupportRoleIds) {
                overwrites.push({
                    id: roleId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages],
                    type: OverwriteType.Role,
                });
            }
            // Create the ticket channel
            const ticketNumber = Date.now().toString().slice(-5);
            const ticketChannel = await guild.channels.create({
                name: `ticket-${user.username}-${ticketNumber}`,
                type: ChannelType.GuildText,
                parent: settings.ticketCategoryId || undefined,
                permissionOverwrites: overwrites,
                topic: `Support ticket for ${user.tag} | User ID: ${user.id}`,
            });
            openTickets.set(ticketKey, ticketChannel.id);
            // Create ticket analytics entry
            await db.ticketAnalytics.create({
                data: {
                    guildId,
                    ticketId: ticketChannel.id,
                    userId: user.id,
                    userName: user.tag,
                    aiHandled: false,
                    aiResolved: false,
                    escalated: false,
                    messageCount: 0,
                    aiMessageCount: 0,
                },
            }).catch(() => { });
            // Send welcome message in ticket using Components V2
            const colorHex = settings.ticketPanelColor || '#6366f1';
            const colorInt = parseInt(colorHex.replace('#', ''), 16) || 0x6366f1;
            const { buildTicketWelcomeCV2 } = await import('../utils/cv2.js');
            const welcomePayload = buildTicketWelcomeCV2({
                reason: 'General Support',
                userMention: `<@${user.id}>`,
                creatorTag: user.tag,
                accentColor: colorInt,
                closeCustomId: `ticket:close:${user.id}`,
            });
            const mentionLine = settings.ticketSupportRoleIds.length > 0
                ? settings.ticketSupportRoleIds.map(id => `<@&${id}>`).join(' ')
                : '';
            await ticketChannel.send({
                content: mentionLine || undefined,
                ...welcomePayload,
            });
            // Record welcome message in ticket history
            await db.ticketMessage.create({
                data: {
                    guildId,
                    ticketId: ticketChannel.id,
                    userId: guild.client.user?.id || 'system',
                    userName: '🤖 Ticket System',
                    content: `🎫 **Ticket opened** by ${user.tag} for **General Support**.\nSupport will be with you shortly.`,
                    isAI: false,
                },
            }).catch(() => { });
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#22c55e')
                        .setDescription(`✅ Your ticket has been created: <#${ticketChannel.id}>`),
                ],
            });
        }
        catch (err) {
            console.error('[Ticket Open Error]', err);
            await interaction.editReply({
                embeds: [new EmbedBuilder().setColor('#ef4444').setDescription('❌ Failed to create ticket. Check bot permissions.')],
            });
        }
        return;
    }
    // ── Close Ticket ─────────────────────────────────────────────────────────────
    if (customId.startsWith('ticket:close:') && interaction.isButton()) {
        const ticketChannel = interaction.channel;
        const originalUserId = customId.split(':')[2];
        const ticketKey = `${guildId}:${originalUserId}`;
        // Get guild settings for transcript
        const settings = await db.guild.findUnique({
            where: { discordId: guildId },
            select: {
                ticketTranscriptEnabled: true,
                ticketTranscriptChannelId: true,
            },
        });
        const closingEmbed = new EmbedBuilder()
            .setColor('#ef4444')
            .setTitle('🔒 Ticket Closing...')
            .setDescription(settings?.ticketTranscriptEnabled
            ? 'Generating transcript... This ticket will be deleted shortly.'
            : 'This ticket will be deleted in 5 seconds.')
            .setTimestamp();
        await interaction.reply({ embeds: [closingEmbed] });
        openTickets.delete(ticketKey);
        // Sync any messages from Discord channel into DB so browser transcript has complete log
        try {
            const fetchedMsgs = await ticketChannel.messages.fetch({ limit: 100 }).catch(() => null);
            if (fetchedMsgs) {
                for (const msg of Array.from(fetchedMsgs.values()).reverse()) {
                    const content = msg.content || (msg.attachments.size > 0 ? `[${msg.attachments.size} attachment(s)]` : '');
                    if (!content)
                        continue;
                    const exists = await db.ticketMessage.findFirst({
                        where: {
                            ticketId: ticketChannel.id,
                            userId: msg.author.id,
                            content,
                        },
                    });
                    if (!exists) {
                        await db.ticketMessage.create({
                            data: {
                                guildId: guildId,
                                ticketId: ticketChannel.id,
                                userId: msg.author.id,
                                userName: msg.author.tag || msg.author.username,
                                content,
                                isAI: msg.author.bot,
                                createdAt: msg.createdAt,
                            },
                        }).catch(() => { });
                    }
                }
            }
        }
        catch (err) {
            console.error('[Ticket Transcript Sync Error]', err);
        }
        // Update ticket analytics
        const totalMsgs = await db.ticketMessage.count({
            where: { ticketId: ticketChannel.id },
        }).catch(() => 0);
        await db.ticketAnalytics.updateMany({
            where: { ticketId: ticketChannel.id },
            data: {
                closedAt: new Date(),
                messageCount: totalMsgs > 0 ? totalMsgs : undefined,
            },
        }).catch(() => { });
        // Generate and send transcript if enabled
        if (settings?.ticketTranscriptEnabled && settings.ticketTranscriptChannelId) {
            try {
                console.log(`[Transcript] Generating transcript for ticket ${ticketChannel.name}...`);
                // Generate HTML transcript
                const transcript = await createTranscript(ticketChannel, {
                    limit: -1, // All messages
                    filename: `transcript-${ticketChannel.name}-${Date.now()}.html`,
                    saveImages: true,
                    poweredBy: false,
                    footerText: 'Powered by Layer',
                });
                // Get transcript channel
                const transcriptChannel = await guild.channels.fetch(settings.ticketTranscriptChannelId);
                if (transcriptChannel && transcriptChannel.isTextBased()) {
                    // Create embed for transcript
                    const transcriptEmbed = new EmbedBuilder()
                        .setColor('#6366f1')
                        .setTitle('📝 Ticket Transcript')
                        .setDescription(`**Ticket:** ${ticketChannel.name}\n` +
                        `**Closed by:** ${interaction.user.tag}\n` +
                        `**Closed at:** <t:${Math.floor(Date.now() / 1000)}:F>`)
                        .setFooter({ text: 'Ticket closed' })
                        .setTimestamp();
                    // Send transcript
                    await transcriptChannel.send({
                        embeds: [transcriptEmbed],
                        files: [transcript],
                    });
                    console.log(`[Transcript] Sent transcript to channel ${settings.ticketTranscriptChannelId}`);
                }
            }
            catch (error) {
                console.error('[Transcript] Error generating/sending transcript:', error);
            }
        }
        setTimeout(async () => {
            await ticketChannel.delete('Ticket closed').catch(() => { });
        }, 5000);
    }
}
