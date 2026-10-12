import { Client, Collection, GatewayIntentBits, Partials, Events, REST, Routes, } from 'discord.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { addXP, ACHIEVEMENTS } from './commands/leveling/rank.js';
import { detectScam } from './utils/scamDetector.js';
import { checkCooldown, COOLDOWNS } from './utils/cooldowns.js';
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// ─── Client ─────────────────────────────────────────────────────────────────
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
const commands = new Collection();
// ─── Cooldown Helper ────────────────────────────────────────────────────────
function getCooldownForCommand(commandName) {
    // Map command names to cooldown configs
    const cooldownMap = {
        'ban': COOLDOWNS.BAN,
        'kick': COOLDOWNS.KICK,
        'mute': COOLDOWNS.MUTE,
        'warn': COOLDOWNS.WARN,
        'clear': COOLDOWNS.CLEAR,
        'play': COOLDOWNS.PLAY,
        'skip': COOLDOWNS.SKIP,
        'stop': COOLDOWNS.STOP,
        'pause': COOLDOWNS.PAUSE,
        'resume': COOLDOWNS.RESUME,
        'volume': COOLDOWNS.VOLUME,
        'queue': COOLDOWNS.QUEUE,
        'rank': COOLDOWNS.RANK,
        'leaderboard': COOLDOWNS.LEADERBOARD,
        'ask': COOLDOWNS.AI_ASK,
        'serverinfo': COOLDOWNS.SERVERINFO,
        'userinfo': COOLDOWNS.USERINFO,
        'giveaway': COOLDOWNS.GIVEAWAY,
        'poll': COOLDOWNS.POLL,
    };
    return cooldownMap[commandName] || COOLDOWNS.DEFAULT;
}
// ─── Load commands from all subfolders ──────────────────────────────────────
async function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const categories = fs.readdirSync(commandsPath);
    for (const category of categories) {
        const categoryPath = path.join(commandsPath, category);
        if (!fs.statSync(categoryPath).isDirectory())
            continue;
        const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
        for (const file of files) {
            const filePath = path.join(categoryPath, file);
            const commandUrl = pathToFileURL(filePath).href;
            const command = await import(commandUrl);
            if (command.data && typeof command.execute === 'function') {
                commands.set(command.data.name, command);
                console.log(`  ✓ Loaded /${command.data.name}`);
            }
        }
    }
}
// ─── Deploy slash commands to Discord ───────────────────────────────────────
async function deployCommands() {
    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.DEV_GUILD_ID;
    const rest = new REST({ version: '10' }).setToken(token);
    const commandsJSON = [...commands.values()].map((c) => c.data.toJSON());
    if (guildId) {
        console.log(`\n📤 Deploying ${commandsJSON.length} slash commands to dev guild (instant)...`);
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsJSON });
        console.log(`✅ Slash commands deployed to guild ${guildId}.\n`);
    }
    else {
        console.log(`\n📤 Deploying ${commandsJSON.length} slash commands globally...`);
        await rest.put(Routes.applicationCommands(clientId), { body: commandsJSON });
        console.log('✅ Slash commands deployed globally.\n');
    }
}
import { setupPlayer } from './player.js';
import { startGiveawayManager } from './utils/giveawayManager.js';
import { GhostCleaner } from './utils/ghostCleaner.js';
// ─── Ready ──────────────────────────────────────────────────────────────────
client.once(Events.ClientReady, async (c) => {
    console.log(`\n🟣 Layer Bot online as ${c.user.tag}`);
    console.log(`   Guilds: ${c.guilds.cache.size}`);
    // Professional rotating status
    const statuses = [
        { name: 'your server 🛡️', type: 3 }, // Watching
        { name: '/help for commands', type: 2 }, // Listening
        { name: `${c.guilds.cache.size} servers`, type: 3 }, // Watching
        { name: 'AI-powered moderation', type: 0 }, // Playing
        { name: 'for scams and spam', type: 3 }, // Watching
    ];
    let currentStatus = 0;
    const updateStatus = () => {
        c.user.setPresence({
            activities: [statuses[currentStatus]],
            status: 'online',
        });
        currentStatus = (currentStatus + 1) % statuses.length;
    };
    // Set initial status
    updateStatus();
    // Rotate status every 30 seconds
    setInterval(updateStatus, 30000);
    await setupPlayer(client);
    console.log(`   Music Player: Initialized`);
    // Start giveaway manager
    startGiveawayManager(client);
    console.log(`   Giveaway Manager: Started (checking every 30 seconds)`);
    // Calculate time until next 3 AM
    const now = new Date();
    const next3AM = new Date(now);
    next3AM.setHours(3, 0, 0, 0);
    if (next3AM <= now) {
        next3AM.setDate(next3AM.getDate() + 1);
    }
    const msUntil3AM = next3AM.getTime() - now.getTime();
    // Schedule first run at 3 AM, then repeat every 24 hours
    setTimeout(async () => {
        for (const guild of client.guilds.cache.values()) {
            await GhostCleaner.executeScheduledKicks(guild).catch(() => { });
        }
        setInterval(async () => {
            for (const guild of client.guilds.cache.values()) {
                await GhostCleaner.executeScheduledKicks(guild).catch(() => { });
            }
        }, 24 * 60 * 60 * 1000); // Every 24 hours
    }, msUntil3AM);
    console.log(`   Ghost Cleaner: Scheduled (next run at 3:00 AM)`);
    await deployCommands();
});
// ─── Welcome/Leave System ────────────────────────────────────────────────────
import { handleMemberJoin, handleMemberLeave } from './events/welcomeHandler.js';
client.on(Events.GuildMemberAdd, async (member) => {
    await handleMemberJoin(member);
    // Impersonation Detection for new members
    const { handleNewMember } = await import('./events/impersonationHandler.js');
    await handleNewMember(member);
});
client.on(Events.GuildMemberRemove, async (member) => {
    await handleMemberLeave(member);
});
// ─── Avatar Tracking ─────────────────────────────────────────────────────────
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const { handleAvatarChange } = await import('./events/avatarTrackingHandler.js');
    await handleAvatarChange(oldMember, newMember);
});
// ─── Poll Reactions ──────────────────────────────────────────────────────────
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    const { handlePollReactionAdd } = await import('./events/pollHandler.js');
    await handlePollReactionAdd(reaction, user);
});
client.on(Events.MessageReactionRemove, async (reaction, user) => {
    const { handlePollReactionRemove } = await import('./events/pollHandler.js');
    await handlePollReactionRemove(reaction, user);
});
// ─── Slash command handling ──────────────────────────────────────────────────
client.on(Events.InteractionCreate, async (interaction) => {
    // Slash commands
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command)
            return;
        // Check cooldown
        const cooldownConfig = getCooldownForCommand(interaction.commandName);
        const cooldownCheck = checkCooldown(interaction.user.id, interaction.commandName, cooldownConfig);
        if (!cooldownCheck.allowed) {
            await interaction.reply({
                content: `⏰ Please wait ${cooldownCheck.remainingSeconds} seconds before using this command again.`,
                ephemeral: true,
            }).catch(() => { });
            return;
        }
        try {
            await command.execute(interaction);
            // Log command execution
            if (interaction.guildId) {
                const { db } = await import('./db.js');
                await db.auditLog.create({
                    data: {
                        guildId: interaction.guildId,
                        action: 'COMMAND_EXECUTED',
                        userId: interaction.user.id,
                        userName: interaction.user.tag,
                        details: `/${interaction.commandName}`,
                        metadata: {
                            commandName: interaction.commandName,
                            channelId: interaction.channelId,
                        },
                    },
                }).catch(() => { }); // Silent fail
            }
        }
        catch (err) {
            console.error(`Error in /${interaction.commandName}:`, err);
            const errMsg = { content: '❌ Ein Fehler ist aufgetreten.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errMsg).catch(() => { });
            }
            else {
                await interaction.reply(errMsg).catch(() => { });
            }
        }
        return;
    }
    // Modal submissions
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'setup_modal') {
            const { handleSetupModal } = await import('./commands/ai/setup.js');
            await handleSetupModal(interaction);
            return;
        }
        if (interaction.customId === 'verification:captcha') {
            const { handleVerificationModal } = await import('./events/verificationHandler.js');
            await handleVerificationModal(interaction);
            return;
        }
        return;
    }
    // Button clicks
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('setup_')) {
            const { handleSetupButton } = await import('./commands/ai/setup.js');
            await handleSetupButton(interaction);
            return;
        }
        if (interaction.customId.startsWith('ticket:')) {
            const { handleTicketButton } = await import('./events/ticketHandler.js');
            await handleTicketButton(interaction).catch((err) => {
                console.error('[Ticket Handler Error]', err);
            });
            return;
        }
        if (interaction.customId === 'verification:verify') {
            const { handleVerificationButton } = await import('./events/verificationHandler.js');
            await handleVerificationButton(interaction);
            return;
        }
        if (interaction.customId === 'giveaway:enter') {
            const { handleGiveawayEnter } = await import('./events/giveawayHandler.js');
            await handleGiveawayEnter(interaction);
            return;
        }
        if (interaction.customId.startsWith('impersonation:')) {
            const { handleImpersonationButton } = await import('./events/impersonationHandler.js');
            await handleImpersonationButton(interaction);
            return;
        }
        return;
    }
    // String Select Menu (Dropdown)
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId.startsWith('ticket:')) {
            const { handleTicketButton } = await import('./events/ticketHandler.js');
            await handleTicketButton(interaction).catch((err) => {
                console.error('[Ticket Handler Error]', err);
            });
            return;
        }
        return;
    }
});
// ─── XP & Auto Moderation ───────────────────────────────────────────────────
const spamTracker = new Map();
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.guild)
        return;
    try {
        const { db } = await import('./db.js');
        const guildSettings = await db.guild.findUnique({
            where: { discordId: message.guild.id },
        });
        // AI Ticket Moderator (runs FIRST for ticket channels)
        const chName = 'name' in message.channel ? message.channel.name : '';
        if (chName?.startsWith('ticket-') || message.channel.isThread()) {
            const { handleTicketMessage } = await import('./utils/aiTicketModerator.js');
            await handleTicketMessage(message);
        }
        // Auto-Mod Check (runs BEFORE anti-scam)
        if (guildSettings) {
            const { checkAutoMod, executeAutoModAction } = await import('./utils/autoMod.js');
            const autoModResult = await checkAutoMod(message, guildSettings);
            if (autoModResult) {
                await executeAutoModAction(message, autoModResult, guildSettings);
                return; // Stop processing further
            }
        }
        // Anti-Scam Check (runs AFTER auto-mod, independent of moderation module)
        if (guildSettings?.antiScamEnabled) {
            console.log(`[Anti-Scam] Checking message from ${message.author.tag} in ${message.guild.name}`);
            const scamResult = await detectScam(message, guildSettings.scamSensitivity);
            console.log(`[Anti-Scam] Result: isScam=${scamResult.isScam}, confidence=${scamResult.confidence}%, type=${scamResult.type}`);
            // Log AI token usage if AI was used
            if (scamResult.tokens && scamResult.tokens > 0) {
                await db.auditLog.create({
                    data: {
                        guildId: message.guild.id,
                        action: 'AI_TOKENS_USED',
                        userId: message.author.id,
                        userName: message.author.tag,
                        details: `Anti-scam image analysis`,
                        metadata: { tokens: scamResult.tokens, feature: 'anti-scam' },
                    },
                }).catch(() => { }); // Silent fail
                console.log(`[AI Tokens] Logged ${scamResult.tokens} tokens for anti-scam detection`);
            }
            if (scamResult.isScam) {
                console.log(`[Anti-Scam] 🚨 SCAM DETECTED! Deleting message...`);
                await message.delete().catch(() => { });
                const { EmbedBuilder } = await import('discord.js');
                const embed = new EmbedBuilder()
                    .setColor('#dc2626')
                    .setTitle('🚨 Scam Detected & Removed')
                    .setDescription(`${message.author}, your message was automatically deleted because it appears to contain scam content.`)
                    .addFields({ name: 'Detection Type', value: scamResult.type.toUpperCase(), inline: true }, { name: 'Confidence', value: `${scamResult.confidence}%`, inline: true }, { name: 'Reason', value: scamResult.reason })
                    .setFooter({ text: 'If this was a mistake, please contact a moderator.' })
                    .setTimestamp();
                const warningMsg = await message.channel.send({ embeds: [embed] });
                // Log to audit channel if configured
                if (guildSettings.logChannelId) {
                    const logChannel = message.guild.channels.cache.get(guildSettings.logChannelId);
                    if (logChannel && logChannel.isTextBased()) {
                        const logEmbed = new EmbedBuilder()
                            .setColor('#dc2626')
                            .setTitle('🚨 Anti-Scam: Message Deleted')
                            .addFields({ name: 'User', value: `${message.author.tag} (${message.author.id})`, inline: true }, { name: 'Channel', value: `<#${message.channel.id}>`, inline: true }, { name: 'Confidence', value: `${scamResult.confidence}%`, inline: true }, { name: 'Type', value: scamResult.type, inline: true }, { name: 'Reason', value: scamResult.reason }, { name: 'Content', value: message.content || '*[Image/Attachment]*' })
                            .setTimestamp();
                        // Generate HTML report with embedded images
                        try {
                            const { generateScamReport } = await import('./utils/scamReportGenerator.js');
                            const htmlReport = await generateScamReport(message, scamResult);
                            await logChannel.send({
                                embeds: [logEmbed],
                                files: [htmlReport]
                            });
                        }
                        catch (reportError) {
                            console.error('[Scam Detector] Failed to generate HTML report:', reportError.message);
                            // Fallback: send without report
                            logChannel.send({ embeds: [logEmbed] }).catch(() => { });
                        }
                    }
                }
                // Delete warning after 10 seconds
                setTimeout(() => {
                    warningMsg.delete().catch(() => { });
                }, 10000);
                return; // Stop processing further
            }
        }
        if (guildSettings?.moderationEnabled) {
            // Banned Words Check
            if (guildSettings.bannedWords.length > 0) {
                const contentLower = message.content.toLowerCase();
                const hasBannedWord = guildSettings.bannedWords.some(word => contentLower.includes(word.toLowerCase()));
                if (hasBannedWord) {
                    await message.delete();
                    const { EmbedBuilder } = await import('discord.js');
                    const embed = new EmbedBuilder()
                        .setColor('#ef4444')
                        .setDescription(`⚠️ ${message.author}, that word is not allowed here!`);
                    const warningMsg = await message.channel.send({ embeds: [embed] });
                    // Delete warning after 5 seconds
                    setTimeout(() => {
                        warningMsg.delete().catch(() => { });
                    }, 5000);
                    return; // Stop processing further
                }
            }
            // Basic Anti-Spam Check
            if (guildSettings.antiSpamEnabled) {
                const now = Date.now();
                const userSpamKey = `${message.guild.id}-${message.author.id}`;
                const timestamps = spamTracker.get(userSpamKey) || [];
                // Keep only timestamps from the last 5 seconds
                const recentTimestamps = timestamps.filter(ts => now - ts < 5000);
                recentTimestamps.push(now);
                spamTracker.set(userSpamKey, recentTimestamps);
                // If more than 4 messages in 5 seconds -> Spam Detected
                if (recentTimestamps.length > 4) {
                    await message.delete().catch(() => { });
                    const lockKey = `${userSpamKey}-locked`;
                    if (!spamTracker.has(lockKey)) {
                        // Lock to prevent duplicate warnings from parallel events
                        spamTracker.set(lockKey, [1]);
                        setTimeout(() => spamTracker.delete(lockKey), 5000);
                        // Clear their tracker so they don't get 10 warnings if they spam 10 times
                        spamTracker.set(userSpamKey, []);
                        const { EmbedBuilder } = await import('discord.js');
                        const embed = new EmbedBuilder()
                            .setColor('#f97316')
                            .setDescription(`⚠️ ${message.author}, you are sending messages too quickly. Please slow down!`);
                        const warningMsg = await message.channel.send({ embeds: [embed] });
                        setTimeout(() => warningMsg.delete().catch(() => { }), 5000);
                    }
                    return; // Stop processing further
                }
            }
        }
        // Award 5-15 XP per message if Leveling is enabled (with cooldown to prevent farming)
        if (guildSettings?.levelingEnabled) {
            const xpCooldown = checkCooldown(message.author.id, 'xp-gain', COOLDOWNS.XP_GAIN);
            if (xpCooldown.allowed) {
                const baseXp = Math.floor(Math.random() * 11) + 5; // 5-15 XP
                const result = await addXP(message.guild.id, message.author.id, message.author.username, baseXp, 1.0, // Base multiplier
                'message');
                if (result?.leveledUp) {
                    // Send level up announcement
                    if (result.channelId) {
                        const channel = message.guild.channels.cache.get(result.channelId);
                        if (channel && channel.isTextBased()) {
                            const streakText = result.currentStreak > 1 ? ` 🔥 ${result.currentStreak} day streak! (+${result.streakBonus}% XP)` : '';
                            channel.send(`🎉 Congratulations ${message.author}! You've reached **Level ${result.newLevel}**!${streakText}`).catch(() => { });
                        }
                    }
                    // Assign role reward
                    if (result.roleId && message.member) {
                        const role = message.guild.roles.cache.get(result.roleId);
                        if (role) {
                            message.member.roles.add(role).catch(() => { });
                        }
                    }
                }
                // Announce new achievements
                if (result?.newAchievements && result.newAchievements.length > 0) {
                    const achievementMessages = result.newAchievements.map(id => {
                        const achievement = Object.values(ACHIEVEMENTS).find((a) => a.id === id);
                        return achievement ? `${achievement.name} — *${achievement.description}*` : null;
                    }).filter(Boolean);
                    if (achievementMessages.length > 0 && result.channelId) {
                        const channel = message.guild.channels.cache.get(result.channelId);
                        if (channel && channel.isTextBased()) {
                            channel.send(`🎖️ ${message.author} unlocked new achievement${achievementMessages.length > 1 ? 's' : ''}!\n${achievementMessages.join('\n')}`).catch(() => { });
                        }
                    }
                }
            }
        }
        // Log message activity (once per day per user to avoid spam)
        const today = new Date().toISOString().split('T')[0];
        const messageKey = `msg:${message.guild.id}:${message.author.id}:${today}`;
        const globalAny = global;
        if (!globalAny.messageLogCache)
            globalAny.messageLogCache = new Set();
        if (!globalAny.messageLogCache.has(messageKey)) {
            globalAny.messageLogCache.add(messageKey);
            const loggedChannelName = 'name' in message.channel ? message.channel.name : 'unknown';
            await db.auditLog.create({
                data: {
                    guildId: message.guild.id,
                    action: 'MESSAGE_SENT',
                    userId: message.author.id,
                    userName: message.author.tag,
                    details: `Message in #${loggedChannelName || 'unknown'}`,
                    metadata: {
                        channelId: message.channel.id,
                        channelName: loggedChannelName,
                        hasAttachments: message.attachments.size > 0,
                    },
                },
            }).catch(() => { }); // Silent fail
        }
    }
    catch (error) {
        console.error('Error in message processing (Moderation/DB):', error);
    }
});
// ─── Boot ────────────────────────────────────────────────────────────────────
console.log('⏳ Loading commands...');
await loadCommands();
client.login(process.env.DISCORD_TOKEN);
// ─── API Server for Dashboard Integration ───────────────────────────────────
import express from 'express';
import { sendVerificationPanelHandler } from './api/send-verification-panel.js';
import { autoLockServerHandler } from './api/auto-lock-server.js';
import { createGiveawayHandler, endGiveawayHandler, rerollGiveawayHandler, } from './api/giveaway-api.js';
const app = express();
app.use(express.json());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
// Send verification panel
app.post('/api/send-verification-panel', (req, res) => {
    sendVerificationPanelHandler(req, res, client);
});
// Auto-lock server
app.post('/api/auto-lock-server', (req, res) => {
    autoLockServerHandler(req, res, client);
});
// Giveaway endpoints
app.post('/api/create-giveaway', (req, res) => {
    createGiveawayHandler(req, res, client);
});
app.post('/api/end-giveaway', (req, res) => {
    endGiveawayHandler(req, res, client);
});
app.post('/api/reroll-giveaway', (req, res) => {
    rerollGiveawayHandler(req, res, client);
});
const PORT = process.env.BOT_API_PORT || 3001;
app.listen(PORT, () => {
    console.log(`   API Server: Running on port ${PORT}`);
});
