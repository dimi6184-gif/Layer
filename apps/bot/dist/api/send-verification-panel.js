import { TextChannel, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
export async function sendVerificationPanelHandler(req, res, client) {
    try {
        // Auth check
        const authHeader = req.headers.authorization;
        const expectedAuth = `Bearer ${process.env.BOT_API_SECRET || 'dev-secret'}`;
        if (authHeader !== expectedAuth) {
            return res.status(401).send('Unauthorized');
        }
        const { guildId, channelId, embed, button } = req.body;
        if (!guildId || !channelId || !embed || !button) {
            return res.status(400).send('Missing required fields');
        }
        // Get guild
        const guild = await client.guilds.fetch(guildId);
        if (!guild) {
            return res.status(404).send('Guild not found');
        }
        // Get channel
        const channel = await guild.channels.fetch(channelId);
        if (!channel || !(channel instanceof TextChannel)) {
            return res.status(400).send('Invalid channel');
        }
        // Create embed
        const embedMessage = new EmbedBuilder()
            .setTitle(embed.title)
            .setDescription(embed.description)
            .setColor(embed.color)
            .setTimestamp();
        // Create button
        const buttonComponent = new ButtonBuilder()
            .setCustomId('verification:verify')
            .setLabel(button.label)
            .setEmoji(button.emoji)
            .setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder().addComponents(buttonComponent);
        // Send message
        await channel.send({
            embeds: [embedMessage],
            components: [row],
        });
        console.log(`[API] Verification panel sent to #${channel.name} in ${guild.name}`);
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('[API] Error sending verification panel:', error);
        res.status(500).send(error.message || 'Internal server error');
    }
}
