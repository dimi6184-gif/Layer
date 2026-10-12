import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@nexus/db';
export const data = new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask the Layer AI a question.')
    .addStringOption((o) => o.setName('question')
    .setDescription('Your question')
    .setRequired(true));
export async function execute(interaction) {
    const question = interaction.options.getString('question', true);
    const guildId = interaction.guildId;
    await interaction.deferReply();
    try {
        // Fetch guild settings from database
        const guild = guildId
            ? await db.guild.findUnique({ where: { discordId: guildId } })
            : null;
        // Check if AI is enabled for this server
        if (guild && !guild.aiEnabled) {
            await interaction.editReply({ content: '❌ Layer AI is disabled for this server. An admin can enable it in the Layer Dashboard.' });
            return;
        }
        // Use server-specific personality or fall back to default
        const defaultPersonality = 'You are Layer AI, a professional and helpful AI assistant for Discord. Be concise and helpful.';
        const systemInstruction = guild?.personality?.trim() || defaultPersonality;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.5-flash',
            systemInstruction,
        });
        const result = await model.generateContent(`Answer briefly and concisely (max 300 characters): ${question}`);
        const response = result.response.text();
        // Log AI token usage
        const usageMetadata = result.response.usageMetadata;
        if (guildId && usageMetadata) {
            const totalTokens = usageMetadata.totalTokenCount || 0;
            try {
                await db.auditLog.create({
                    data: {
                        guildId,
                        action: 'AI_TOKENS_USED',
                        userId: interaction.user.id,
                        userName: interaction.user.username,
                        details: `/ask command: "${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`,
                        metadata: { tokens: totalTokens, command: 'ask' },
                    },
                });
                console.log(`[AI Tokens] Logged ${totalTokens} tokens for /ask command`);
            }
            catch (err) {
                console.error('[AI Tokens] Failed to log token usage:', err);
            }
        }
        const embed = new EmbedBuilder()
            .setColor('#7c3aed')
            .setAuthor({ name: 'Layer AI', iconURL: 'https://cdn-icons-png.flaticon.com/512/8649/8649596.png' })
            .setThumbnail(interaction.user.displayAvatarURL({ size: 64 }))
            .addFields({ name: '❓ Question', value: question }, { name: '💬 Answer', value: response });
        await interaction.editReply({ embeds: [embed] });
    }
    catch (err) {
        console.error('[/ask] AI Error:', err);
        await interaction.editReply({ content: '❌ The AI failed to respond. Please try again in a moment.' });
    }
}
