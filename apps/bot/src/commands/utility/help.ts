import { SlashCommandBuilder, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle } from 'discord.js';
import { buildCV2 } from '../../utils/cv2.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Shows a clean overview of Layer features and commands.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const dashboardButton = new ButtonBuilder()
    .setLabel('Open Dashboard')
    .setURL('https://uselayer.de/dashboard')
    .setStyle(ButtonStyle.Link);

  const websiteButton = new ButtonBuilder()
    .setLabel('Website')
    .setURL('https://uselayer.de')
    .setStyle(ButtonStyle.Link);

  const inviteButton = new ButtonBuilder()
    .setLabel('Invite Bot')
    .setURL('https://uselayer.de/invite')
    .setStyle(ButtonStyle.Link);

  await interaction.reply(
    buildCV2({
      title: 'Layer — Overview & Commands',
      description: 'The smart AI security and community bot for Discord.\nManage all settings, logs and modules directly in the web dashboard.',
      accentColor: 0x1fa7bb, // Layer signature teal
      thumbnail: interaction.client.user?.displayAvatarURL({ size: 128 }) ?? 'https://uselayer.de/logo.png',
      fields: [
        {
          label: '🛡️ AI Protection & Security',
          value: 'Real-time scam detection, OCR image scanning, ban evasion tracking & anti-raid.',
        },
        {
          label: '🔨 Moderation',
          value: '`/ban` • `/kick` • `/mute` • `/warn` • `/warnings` • `/clear` • `/ghostclean`',
        },
        {
          label: '🎫 Tickets & Verification',
          value: '`/ticket` • `/verification` • Smart AI routing & automated captcha onboarding.',
        },
        {
          label: '🎉 Community & Fun',
          value: '`/giveaway` • `/poll` • `/rank` • `/leaderboard` • Achievements & leveling.',
        },
        {
          label: '🎵 Music',
          value: '`/play` • `/queue` • `/pause` • `/resume` • `/skip` • `/stop` • `/volume`',
        },
        {
          label: '⚡ Easy Dashboard Setup',
          value: 'Configure every module with 1 click directly in your browser at [uselayer.de/dashboard](https://uselayer.de/dashboard).',
        },
      ],
      buttons: [dashboardButton, websiteButton, inviteButton],
    })
  );
}
