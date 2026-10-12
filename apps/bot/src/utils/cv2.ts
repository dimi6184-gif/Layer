import {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SectionBuilder,
  ThumbnailBuilder,
  SeparatorSpacingSize,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  MessageFlags,
} from 'discord.js';

export { MessageFlags };

/** A single field shown as a section in a CV2 container */
export interface CV2Field {
  label: string;
  value: string;
}

/** Options for building a standard CV2 response */
export interface CV2Options {
  title: string;
  description?: string;
  fields?: CV2Field[];
  thumbnail?: string;
  /** Accent colour as a hex number, defaults to Layer purple */
  accentColor?: number;
  buttons?: ButtonBuilder[];
}

/**
 * Build a Discord Components V2 message container.
 * Returns { components, flags } ready to spread into reply()/editReply().
 */
export function buildCV2(opts: CV2Options) {
  const { title, description, fields, thumbnail, accentColor = 0x7c3aed, buttons } = opts;

  const container = new ContainerBuilder().setAccentColor(accentColor);

  // ── Header
  let header = `## ${title}`;
  if (description) header += `\n${description}`;

  if (thumbnail) {
    // Section with thumbnail on the right
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(header))
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(thumbnail)),
    );
  } else {
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(header));
  }

  // ── Fields
  if (fields && fields.length > 0) {
    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small),
    );
    const fieldText = fields
      .map((f) => `-# ${f.label}\n${f.value}`)
      .join('\n\n');
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(fieldText));
  }

  // ── Buttons
  if (buttons && buttons.length > 0) {
    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small),
    );
    container.addActionRowComponents(
      new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons),
    );
  }

  return {
    components: [container] as any,
    flags: MessageFlags.IsComponentsV2 as any,
  };
}

/** Helper: success accent (green) */
export const successCV2 = (opts: Omit<CV2Options, 'accentColor'>) =>
  buildCV2({ ...opts, accentColor: 0x22c55e });

/** Helper: warning accent (amber) */
export const warnCV2 = (opts: Omit<CV2Options, 'accentColor'>) =>
  buildCV2({ ...opts, accentColor: 0xf59e0b });

/** Helper: danger accent (red) */
export const dangerCV2 = (opts: Omit<CV2Options, 'accentColor'>) =>
  buildCV2({ ...opts, accentColor: 0xef4444 });

/** Helper: info accent (purple, same as default) */
export const infoCV2 = (opts: Omit<CV2Options, 'accentColor'>) =>
  buildCV2({ ...opts, accentColor: 0x7c3aed });

/**
 * Build Ticket Panel using Discord Components V2
 */
export function buildTicketPanelCV2(opts: {
  title: string;
  description?: string;
  accentColor?: number;
  selectMenu?: StringSelectMenuBuilder;
  button?: ButtonBuilder;
}) {
  const { title, description, accentColor = 0x6366f1, selectMenu, button } = opts;
  const container = new ContainerBuilder().setAccentColor(accentColor);

  let header = `## ${title}`;
  if (description) header += `\n${description}`;
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(header));

  container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent('-# One ticket per user at a time.'));

  if (selectMenu) {
    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    container.addActionRowComponents(
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu),
    );
  } else if (button) {
    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    container.addActionRowComponents(
      new ActionRowBuilder<ButtonBuilder>().addComponents(button),
    );
  }

  return {
    components: [container] as any,
    flags: MessageFlags.IsComponentsV2 as any,
  };
}

/**
 * Build Ticket Channel Welcome Message using Discord Components V2
 */
export function buildTicketWelcomeCV2(opts: {
  reason: string;
  userMention: string;
  creatorTag: string;
  accentColor?: number;
  closeCustomId: string;
}) {
  const { reason, userMention, creatorTag, accentColor = 0x6366f1, closeCustomId } = opts;
  const container = new ContainerBuilder().setAccentColor(accentColor);

  const text = `## 🎫 Ticket Opened: ${reason}\nHey ${userMention}, welcome to your support ticket!\n\n**Reason:** ${reason}\n\nPlease describe your issue and a team member will be with you shortly.\n\nTo close this ticket, click the button below.`;
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(text));

  container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Ticket created by ${creatorTag}`));

  const closeButton = new ButtonBuilder()
    .setCustomId(closeCustomId)
    .setLabel('Close Ticket')
    .setEmoji('🔒')
    .setStyle(ButtonStyle.Danger);

  container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
  container.addActionRowComponents(
    new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton),
  );

  return {
    components: [container] as any,
    flags: MessageFlags.IsComponentsV2 as any,
  };
}

/**
 * Build AI Ticket Moderator Response using Discord Components V2
 */
export function buildTicketAICV2(opts: {
  response: string;
  confidence: number;
  category: string;
  priority: string;
  suggestedActions?: string[];
  avatarURL?: string;
}) {
  const { response, confidence, category, priority, suggestedActions = [] } = opts;
  const accentColor =
    confidence >= 80 ? 0x10b981 :
    confidence >= 60 ? 0xf59e0b :
    0xef4444;

  const container = new ContainerBuilder().setAccentColor(accentColor);
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`### 🤖 AI Support Assistant\n${response}`),
  );

  if (suggestedActions.length > 0) {
    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    const actionsText = `**💡 Suggested Actions:**\n` + suggestedActions.map((a, i) => `${i + 1}. ${a}`).join('\n');
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(actionsText));
  }

  container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`-# Confidence: ${confidence}% • ${category} • ${priority} Priority`),
  );

  return {
    components: [container] as any,
    flags: MessageFlags.IsComponentsV2 as any,
  };
}

