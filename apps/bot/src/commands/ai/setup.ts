import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalSubmitInteraction,
  ChannelType,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
} from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { infoCV2, successCV2, dangerCV2, warnCV2 } from '../../utils/cv2.js';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('🤖 AI automatically creates a complete Discord server for you.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const proceedBtn = new ButtonBuilder()
    .setCustomId('setup_proceed')
    .setLabel('🚨 Yes, delete everything & run setup')
    .setStyle(ButtonStyle.Danger);

  const cancelBtn = new ButtonBuilder()
    .setCustomId('setup_cancel')
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Secondary);

  await interaction.reply({
    ...dangerCV2({
      title: '⚠️ WARNING: Server Reset',
      description: 'This command will **DELETE ALL current channels and roles** before generating the new server. Are you absolutely sure?',
      buttons: [proceedBtn, cancelBtn],
    }),
    ephemeral: true, // Only the admin sees this warning
  });
}

export async function handleSetupButton(interaction: ButtonInteraction) {
  if (interaction.customId === 'setup_cancel') {
    return interaction.update({ components: [], content: '✅ Setup cancelled. Nothing was deleted.', embeds: [] });
  }

  // If proceed, show the modal
  const modal = new ModalBuilder()
    .setCustomId('setup_modal')
    .setTitle('🤖 Layer — AI Server Setup');

  const topicInput = new TextInputBuilder()
    .setCustomId('topic')
    .setLabel('What is your server about?')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('e.g. Minecraft Server, Clan, or Community')
    .setRequired(true)
    .setMaxLength(500);

  const languageInput = new TextInputBuilder()
    .setCustomId('language')
    .setLabel('Main Language')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('English')
    .setRequired(true)
    .setMaxLength(20);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(topicInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(languageInput),
  );

  await interaction.showModal(modal);
}

export async function handleSetupModal(interaction: ModalSubmitInteraction) {
  await interaction.deferReply({ ephemeral: false });

  const topic = interaction.fields.getTextInputValue('topic');
  const language = interaction.fields.getTextInputValue('language');

  await interaction.editReply(warnCV2({
    title: '⏳ Server Reset & AI Generation...',
    description: `The AI is now deleting old channels/roles and building the server.\n\n-# Topic: *${topic}*`,
  }));

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  // Use gemini-3.8-flash
  let modelName = 'gemini-3.8-flash';
  let model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: 'You are Layer, an advanced AI for the Layer Discord Bot. You are an extremely professional Discord Server Architect. Never mention Google or Gemini. Your name is Layer. You MUST respond with ONLY valid JSON, no markdown formatting, no explanations.',
    generationConfig: { 
      responseMimeType: 'application/json',
      temperature: 0.7,
    }
  });

  const prompt = `
You are a Discord Server Architect. The user wants a Discord server about: "${topic}". Language: ${language}.

Create a JSON structure for the server. Respond ONLY with valid JSON, no markdown, no explanations.

CRITICAL: Your response must be ONLY the JSON object, nothing else. No text before or after.

Format:
{
  "serverName": "Creative name for the server",
  "serverDescription": "Short description of the server (max 100 chars)",
  "categories": [
    {
      "name": "📣 || CATEGORY NAME",
      "channels": [
        { 
          "name": "channel-name", 
          "type": "text", 
          "topic": "Short description",
          "permissions": "readonly" or "normal" or "staff-only"
        },
        { 
          "name": "voice-name", 
          "type": "voice",
          "permissions": "normal" or "staff-only"
        }
      ]
    }
  ],
  "roles": [
    { "name": "Role Name", "color": "#HEX", "reason": "Purpose", "permissions": ["MANAGE_CHANNELS", "KICK_MEMBERS"] }
  ]
}

PERMISSION TYPES:
- "readonly": Users can see and read, but cannot send messages (for announcements, rules, info)
- "normal": Everyone can see, send messages, and interact (for general chat, discussions)
- "staff-only": Hidden from @everyone, only staff can see (for mod channels, admin areas)

IMPORTANT RULES:
1. Categories MUST be formatted: emoji + ' || ' + UPPERCASE name (e.g. '📣 || INFORMATION')
2. Text channels MUST be: emoji + '-' + lowercase-name (e.g. '💬-general')
3. Voice channels MUST be: emoji + '-' + lowercase-name (e.g. '🔊-lounge')
4. Create 3-5 categories with 8-15 total channels and 4-7 roles
5. Use thematically fitting emojis
6. All colors must be valid hex codes (e.g. "#7c3aed")
7. Response must be ONLY valid JSON
8. Set appropriate permissions for each channel:
   - Announcements, news, updates, rules, info → "readonly"
   - Staff, mod, admin channels → "staff-only"
   - General, chat, discussion channels → "normal"
   - Welcome, verify channels → "readonly"
9. Set appropriate permissions for each role based on its purpose:
   - Admin roles → ["ADMINISTRATOR"]
   - Moderator roles → ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_EVENTS"]
   - Event Manager roles → ["MANAGE_EVENTS", "MANAGE_CHANNELS"]
   - Staff/Helper roles → ["MANAGE_MESSAGES", "KICK_MEMBERS"]
   - VIP/Premium roles → ["MENTION_EVERYONE", "ATTACH_FILES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"]
   - Member/Default roles → [] (no special permissions)

Example:
{"serverName":"Gaming Hub","serverDescription":"Epic community","categories":[{"name":"📣 || INFO","channels":[{"name":"📢-announcements","type":"text","topic":"Updates","permissions":"readonly"}]},{"name":"💬 || CHAT","channels":[{"name":"💬-general","type":"text","topic":"Chat","permissions":"normal"}]},{"name":"🔒 || STAFF","channels":[{"name":"🛡️-mod-chat","type":"text","topic":"Staff","permissions":"staff-only"}]}],"roles":[{"name":"Admin","color":"#ef4444","reason":"Admins","permissions":["ADMINISTRATOR"]},{"name":"Mod","color":"#3b82f6","reason":"Moderators","permissions":["MANAGE_MESSAGES","KICK_MEMBERS","BAN_MEMBERS","MANAGE_EVENTS"]},{"name":"Event Manager","color":"#10b981","reason":"Event organizers","permissions":["MANAGE_EVENTS"]},{"name":"Member","color":"#7c3aed","reason":"Members","permissions":[]}]}`;


  let parsed: any;
  let retryWithFallback = false;
  
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log('[Setup] AI Raw Response:', text);
    
    // Try to extract JSON from markdown code blocks or plain text
    let jsonText = text;
    
    // Remove markdown code blocks if present
    if (text.includes('```json')) {
      const match = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) jsonText = match[1];
    } else if (text.includes('```')) {
      const match = text.match(/```\s*([\s\S]*?)\s*```/);
      if (match) jsonText = match[1];
    }
    
    // Extract JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Setup] No JSON object found in response');
      throw new Error("No JSON object found in AI response");
    }
    
    parsed = JSON.parse(jsonMatch[0]);
    
    // Validate structure
    if (!parsed.serverName) {
      console.error('[Setup] Missing serverName in parsed JSON');
      throw new Error("Invalid JSON structure: missing serverName");
    }
    
    console.log('[Setup] Successfully parsed JSON:', JSON.stringify(parsed, null, 2));
    
  } catch (err: any) {
    console.error("[Setup] AI Error:", err);
    console.error("[Setup] Error details:", err.message);
    
    // Check if it's a 503 error (high demand) and we haven't tried fallback yet
    if (err.message && err.message.includes('503') && modelName === 'gemini-3.5-flash') {
      console.log('[Setup] Gemini 3.5 Flash unavailable, trying fallback to 1.5-flash...');
      
      await interaction.editReply(warnCV2({
        title: '⏳ Retrying with different model...',
        description: 'Gemini 3.5 Flash is currently busy. Switching to Gemini 1.5 Flash...',
      }));
      
      // Retry with 1.5-flash
      modelName = 'gemini-1.5-flash';
      model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: 'You are Layer, an advanced AI for the Layer Discord Bot. You are an extremely professional Discord Server Architect. Never mention Google or Gemini. Your name is Layer. You MUST respond with ONLY valid JSON, no markdown formatting, no explanations.',
        generationConfig: { 
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });
      
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        console.log('[Setup] Fallback AI Raw Response:', text);
        
        let jsonText = text;
        if (text.includes('```json')) {
          const match = text.match(/```json\s*([\s\S]*?)\s*```/);
          if (match) jsonText = match[1];
        } else if (text.includes('```')) {
          const match = text.match(/```\s*([\s\S]*?)\s*```/);
          if (match) jsonText = match[1];
        }
        
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON object found in fallback response");
        
        parsed = JSON.parse(jsonMatch[0]);
        if (!parsed.serverName) throw new Error("Invalid JSON structure in fallback");
        
        console.log('[Setup] Fallback successful!');
      } catch (fallbackErr: any) {
        console.error('[Setup] Fallback also failed:', fallbackErr);
        return interaction.editReply(dangerCV2({
          title: '❌ AI Error',
          description: `Both AI models failed to generate a valid structure.\n\n**Error:** ${fallbackErr.message}\n\nPlease wait a few minutes and try again.`,
        }));
      }
    } else {
      return interaction.editReply(dangerCV2({
        title: '❌ AI Error',
        description: `The AI could not generate a valid structure. The server has NOT been deleted.\n\n**Error:** ${err.message}\n\nPlease try again${err.message.includes('503') ? ' in a few minutes' : ''}.`,
      }));
    }
  }

  const guild = interaction.guild!;
  let deletedChannels = 0;
  let deletedRoles = 0;
  let createdChannels = 0;
  let createdRoles = 0;

  try {
    // 1. Delete old channels (except the one we are currently in to preserve context)
    const channels = await guild.channels.fetch();
    for (const [id, channel] of channels) {
      if (channel && id !== interaction.channelId) {
        await channel.delete('Layer Setup Reset').catch(() => {});
        deletedChannels++;
      }
    }

    // 2. Delete old roles (except @everyone and bot's highest role)
    const roles = await guild.roles.fetch();
    for (const [id, role] of roles) {
      if (role && role.editable && id !== guild.id) {
        await role.delete('Layer Setup Reset').catch(() => {});
        deletedRoles++;
      }
    }

    // 3. Update Guild Info
    try {
      const updateData: any = {
        name: parsed.serverName ?? topic,
        reason: 'Layer Setup KI',
      };
      
      // Only set description if server is a Community server
      if (guild.features.includes('COMMUNITY')) {
        updateData.description = parsed.serverDescription ?? null;
      }
      
      await guild.edit(updateData);
      
      console.log(`[Setup] Updated server name to: ${updateData.name}`);
      if (updateData.description) {
        console.log(`[Setup] Updated server description to: ${updateData.description}`);
      }
    } catch (err: any) {
      console.error('[Setup] Failed to update guild info:', err);
      // Continue anyway, this is not critical
    }

    // 4. Create new roles with permissions
    for (const role of (parsed.roles ?? [])) {
      const permissions: bigint[] = [];
      
      // Map permission strings to Discord PermissionFlagsBits
      if (role.permissions && Array.isArray(role.permissions)) {
        for (const perm of role.permissions) {
          switch (perm) {
            case 'ADMINISTRATOR':
              permissions.push(PermissionFlagsBits.Administrator);
              break;
            case 'MANAGE_CHANNELS':
              permissions.push(PermissionFlagsBits.ManageChannels);
              break;
            case 'MANAGE_MESSAGES':
              permissions.push(PermissionFlagsBits.ManageMessages);
              break;
            case 'KICK_MEMBERS':
              permissions.push(PermissionFlagsBits.KickMembers);
              break;
            case 'BAN_MEMBERS':
              permissions.push(PermissionFlagsBits.BanMembers);
              break;
            case 'MENTION_EVERYONE':
              permissions.push(PermissionFlagsBits.MentionEveryone);
              break;
            case 'MANAGE_ROLES':
              permissions.push(PermissionFlagsBits.ManageRoles);
              break;
            case 'MANAGE_GUILD':
              permissions.push(PermissionFlagsBits.ManageGuild);
              break;
            case 'MANAGE_NICKNAMES':
              permissions.push(PermissionFlagsBits.ManageNicknames);
              break;
            case 'ATTACH_FILES':
              permissions.push(PermissionFlagsBits.AttachFiles);
              break;
            case 'EMBED_LINKS':
              permissions.push(PermissionFlagsBits.EmbedLinks);
              break;
            case 'USE_EXTERNAL_EMOJIS':
              permissions.push(PermissionFlagsBits.UseExternalEmojis);
              break;
            case 'MANAGE_EVENTS':
              permissions.push(PermissionFlagsBits.ManageEvents);
              break;
            case 'CREATE_EVENTS':
              permissions.push(PermissionFlagsBits.CreateGuildExpressions);
              break;
          }
        }
      }
      
      await guild.roles.create({
        name: role.name,
        color: role.color ?? '#7c3aed',
        permissions: permissions.length > 0 ? permissions : undefined,
        hoist: true,
        reason: `Layer Setup - ${role.reason || 'Generated by AI'}`,
      }).catch((err) => {
        console.error(`[Setup] Failed to create role ${role.name}:`, err);
      });
      createdRoles++;
      console.log(`[Setup] Created role: ${role.name} with ${permissions.length} permissions`);
    }

    // 5. Create new categories and channels
    for (const category of (parsed.categories ?? [])) {
      const cat = await guild.channels.create({
        name: category.name,
        type: ChannelType.GuildCategory,
        reason: `Layer Setup`,
      }).catch(() => null);

      if (cat) {
        for (const ch of (category.channels ?? [])) {
          // Get permission type from AI response
          const permissionType = ch.permissions || 'normal';
          
          // Build permission overwrites based on AI decision
          const permissionOverwrites: any[] = [];

          if (permissionType === 'readonly') {
            // Read-only for @everyone
            permissionOverwrites.push({
              id: guild.id, // @everyone
              deny: [PermissionFlagsBits.SendMessages],
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions],
            });
            console.log(`[Setup] Channel ${ch.name} → READ-ONLY`);
          } else if (permissionType === 'staff-only') {
            // Staff only - hide from @everyone
            permissionOverwrites.push({
              id: guild.id, // @everyone
              deny: [PermissionFlagsBits.ViewChannel],
            });
            // Allow for bot
            permissionOverwrites.push({
              id: guild.members.me!.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
            });
            console.log(`[Setup] Channel ${ch.name} → STAFF ONLY`);
          } else {
            // Normal - everyone can access
            console.log(`[Setup] Channel ${ch.name} → NORMAL`);
          }

          await guild.channels.create({
            name: ch.name,
            type: ch.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText,
            parent: cat.id,
            topic: ch.topic,
            permissionOverwrites: permissionOverwrites.length > 0 ? permissionOverwrites : undefined,
            reason: `Layer Setup`,
          }).catch((err) => {
            console.error(`[Setup] Failed to create channel ${ch.name}:`, err);
          });
          createdChannels++;
        }
      }
    }
  } catch (err: any) {
    return interaction.editReply(warnCV2({
      title: '⚠️ Setup finished with issues',
      description: `Some actions could not be executed due to missing permissions.\n\n-# ${err.message}`,
    }));
  }

  await interaction.editReply(successCV2({
    title: '✅ Server setup complete!',
    description: `**${parsed.serverName ?? topic}** has been generated and built by Layer.${
      guild.features.includes('COMMUNITY') 
        ? `\n\n📝 Server description updated: *${parsed.serverDescription}*`
        : '\n\n💡 *Tip: Enable Community Server in Server Settings to set a server description.*'
    }`,
    fields: [
      { label: '🗑️ Deleted', value: `${deletedChannels} Channels, ${deletedRoles} Roles` },
      { label: '✨ Created', value: `${createdChannels} Channels, ${createdRoles} Roles` },
      { label: '🤖 Generated by', value: 'Layer AI' },
    ],
  }));
}
