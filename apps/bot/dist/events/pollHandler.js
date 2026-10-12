import { db } from '@nexus/db';
const DEFAULT_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
// Helper to check if emoji is a poll emoji (default or custom)
async function isPollEmoji(guildId, emoji) {
    const guildSettings = await db.guild.findUnique({
        where: { discordId: guildId },
        select: { customPollEmojis: true },
    });
    const pollEmojis = guildSettings?.customPollEmojis && guildSettings.customPollEmojis.length === 4
        ? guildSettings.customPollEmojis
        : DEFAULT_EMOJIS;
    const index = pollEmojis.indexOf(emoji);
    return { isValid: index !== -1, index };
}
export async function handlePollReactionAdd(reaction, user) {
    // Ignore bot reactions
    if (user.bot)
        return;
    // Fetch partial data
    if (reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch (error) {
            console.error('[Poll] Failed to fetch reaction:', error);
            return;
        }
    }
    // Check if reaction is a poll emoji
    const emojiCheck = await isPollEmoji(reaction.message.guildId, reaction.emoji.name || '');
    if (!emojiCheck.isValid)
        return;
    try {
        // Find poll in database
        const poll = await db.poll.findUnique({
            where: { messageId: reaction.message.id },
        });
        if (!poll || poll.ended)
            return;
        const optionIndex = emojiCheck.index;
        if (optionIndex >= poll.options.length)
            return;
        // Update votes
        const votes = poll.votes;
        // Remove user from all options (single choice)
        votes.forEach((vote) => {
            vote.userIds = vote.userIds.filter((id) => id !== user.id);
        });
        // Add user to selected option
        if (!votes[optionIndex].userIds.includes(user.id)) {
            votes[optionIndex].userIds.push(user.id);
        }
        // Save to database
        await db.poll.update({
            where: { messageId: reaction.message.id },
            data: { votes },
        });
        console.log(`[Poll] User ${user.tag} voted for option ${optionIndex + 1} in poll ${poll.id}`);
    }
    catch (error) {
        console.error('[Poll] Failed to handle reaction add:', error);
    }
}
export async function handlePollReactionRemove(reaction, user) {
    // Ignore bot reactions
    if (user.bot)
        return;
    // Fetch partial data
    if (reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch (error) {
            console.error('[Poll] Failed to fetch reaction:', error);
            return;
        }
    }
    // Check if reaction is a poll emoji
    const emojiCheck = await isPollEmoji(reaction.message.guildId, reaction.emoji.name || '');
    if (!emojiCheck.isValid)
        return;
    try {
        // Find poll in database
        const poll = await db.poll.findUnique({
            where: { messageId: reaction.message.id },
        });
        if (!poll || poll.ended)
            return;
        const optionIndex = emojiCheck.index;
        if (optionIndex >= poll.options.length)
            return;
        // Update votes
        const votes = poll.votes;
        // Remove user from this option
        votes[optionIndex].userIds = votes[optionIndex].userIds.filter((id) => id !== user.id);
        // Save to database
        await db.poll.update({
            where: { messageId: reaction.message.id },
            data: { votes },
        });
        console.log(`[Poll] User ${user.tag} removed vote from option ${optionIndex + 1} in poll ${poll.id}`);
    }
    catch (error) {
        console.error('[Poll] Failed to handle reaction remove:', error);
    }
}
