/**
 * Input Validation Utilities
 * Prevents resource exhaustion and invalid data
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate Discord ID format (snowflake)
 */
export function validateDiscordId(id: string, fieldName: string = 'ID'): void {
  if (!id) {
    throw new ValidationError(`${fieldName} is required`);
  }
  
  if (!/^\d{17,19}$/.test(id)) {
    throw new ValidationError(`${fieldName} must be a valid Discord ID (17-19 digits)`);
  }
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  options: { min?: number; max?: number }
): void {
  if (options.min !== undefined && value.length < options.min) {
    throw new ValidationError(`${fieldName} must be at least ${options.min} characters`);
  }
  
  if (options.max !== undefined && value.length > options.max) {
    throw new ValidationError(`${fieldName} must be at most ${options.max} characters`);
  }
}

/**
 * Validate array size
 */
export function validateArraySize<T>(
  array: T[],
  fieldName: string,
  options: { min?: number; max?: number }
): void {
  if (options.min !== undefined && array.length < options.min) {
    throw new ValidationError(`${fieldName} must have at least ${options.min} items`);
  }
  
  if (options.max !== undefined && array.length > options.max) {
    throw new ValidationError(`${fieldName} must have at most ${options.max} items`);
  }
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  fieldName: string,
  options: { min?: number; max?: number }
): void {
  if (options.min !== undefined && value < options.min) {
    throw new ValidationError(`${fieldName} must be at least ${options.min}`);
  }
  
  if (options.max !== undefined && value > options.max) {
    throw new ValidationError(`${fieldName} must be at most ${options.max}`);
  }
}

/**
 * Validate color hex code
 */
export function validateHexColor(color: string, fieldName: string = 'Color'): void {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new ValidationError(`${fieldName} must be a valid hex color (e.g., #FF5733)`);
  }
}

/**
 * Sanitize string (remove potentially dangerous characters)
 */
export function sanitizeString(value: string): string {
  // Remove null bytes and control characters (except newlines/tabs)
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Validate Discord IDs in array
 */
export function validateDiscordIds(ids: string[], fieldName: string = 'IDs'): void {
  ids.forEach((id, index) => {
    try {
      validateDiscordId(id, `${fieldName}[${index}]`);
    } catch (error) {
      throw new ValidationError(`Invalid ID at position ${index}: ${(error as Error).message}`);
    }
  });
}

/**
 * Comprehensive ticket settings validation
 */
export function validateTicketSettings(settings: {
  panelTitle: string;
  panelDescription: string;
  panelColor: string;
  buttonLabel: string;
  buttonEmoji: string;
  supportRoleIds: string[];
  categoryId: string | null;
  reasons?: any[];
}): void {
  validateStringLength(settings.panelTitle, 'Panel title', { min: 1, max: 256 });
  validateStringLength(settings.panelDescription, 'Panel description', { min: 1, max: 4096 });
  validateHexColor(settings.panelColor, 'Panel color');
  validateStringLength(settings.buttonLabel, 'Button label', { min: 1, max: 80 });
  validateStringLength(settings.buttonEmoji, 'Button emoji', { min: 1, max: 100 });
  validateArraySize(settings.supportRoleIds, 'Support roles', { max: 25 });
  validateDiscordIds(settings.supportRoleIds, 'Support role IDs');
  
  if (settings.categoryId) {
    validateDiscordId(settings.categoryId, 'Category ID');
  }
  
  if (settings.reasons) {
    validateArraySize(settings.reasons, 'Ticket reasons', { max: 25 });
    settings.reasons.forEach((reason, index) => {
      if (reason.label) {
        validateStringLength(reason.label, `Reason[${index}] label`, { min: 1, max: 100 });
      }
      if (reason.description) {
        validateStringLength(reason.description, `Reason[${index}] description`, { max: 100 });
      }
    });
  }
}

/**
 * Validate auto-mod settings
 */
export function validateAutoModSettings(settings: {
  autoModSpamMaxMessages: number;
  autoModSpamTimeframe: number;
  autoModSpamTimeoutDuration: number;
  autoModCapsThreshold: number;
  autoModCapsMinLength: number;
  autoModMentionsMax: number;
  autoModEmojisMax: number;
  autoModLinksWhitelist: string[];
  autoModWhitelistChannels: string[];
  autoModWhitelistRoles: string[];
  autoModDuplicatesTimeframe: number;
}): void {
  validateNumberRange(settings.autoModSpamMaxMessages, 'Spam max messages', { min: 2, max: 100 });
  validateNumberRange(settings.autoModSpamTimeframe, 'Spam timeframe', { min: 1, max: 60 });
  validateNumberRange(settings.autoModSpamTimeoutDuration, 'Timeout duration', { min: 60, max: 2592000 }); // 1 min to 30 days
  validateNumberRange(settings.autoModCapsThreshold, 'Caps threshold', { min: 50, max: 100 });
  validateNumberRange(settings.autoModCapsMinLength, 'Caps min length', { min: 5, max: 100 });
  validateNumberRange(settings.autoModMentionsMax, 'Max mentions', { min: 1, max: 50 });
  validateNumberRange(settings.autoModEmojisMax, 'Max emojis', { min: 1, max: 50 });
  validateNumberRange(settings.autoModDuplicatesTimeframe, 'Duplicates timeframe', { min: 1, max: 60 });
  
  validateArraySize(settings.autoModLinksWhitelist, 'Links whitelist', { max: 100 });
  validateArraySize(settings.autoModWhitelistChannels, 'Whitelist channels', { max: 50 });
  validateArraySize(settings.autoModWhitelistRoles, 'Whitelist roles', { max: 50 });
  
  validateDiscordIds(settings.autoModWhitelistChannels, 'Whitelist channel IDs');
  validateDiscordIds(settings.autoModWhitelistRoles, 'Whitelist role IDs');
}

/**
 * Validate AI ticket settings
 */
export function validateAITicketSettings(settings: {
  staffRoleIds: string[];
  maxMessages: number;
  autoDelay: number;
  escalateAfter: number;
  confidenceMin: number;
  escalateRoleIds: string[];
  blacklist: string[];
  whitelist: string[];
  personality: string | null;
}): void {
  validateArraySize(settings.staffRoleIds, 'Staff roles', { max: 25 });
  validateDiscordIds(settings.staffRoleIds, 'Staff role IDs');
  
  validateNumberRange(settings.maxMessages, 'Max messages', { min: 1, max: 100 });
  validateNumberRange(settings.autoDelay, 'Auto delay', { min: 0, max: 300 }); // 0-5 minutes
  validateNumberRange(settings.escalateAfter, 'Escalate after', { min: 1, max: 100 });
  validateNumberRange(settings.confidenceMin, 'Confidence minimum', { min: 0, max: 100 });
  
  validateArraySize(settings.escalateRoleIds, 'Escalate roles', { max: 25 });
  validateDiscordIds(settings.escalateRoleIds, 'Escalate role IDs');
  
  validateArraySize(settings.blacklist, 'Blacklist', { max: 100 });
  validateArraySize(settings.whitelist, 'Whitelist', { max: 100 });
  
  if (settings.personality) {
    validateStringLength(settings.personality, 'Personality', { max: 2000 });
  }
}

/**
 * Validate general settings
 */
export function validateGeneralSettings(settings: {
  prefix: string;
  logChannelId: string | null;
  bannedWords: string[];
}): void {
  validateStringLength(settings.prefix, 'Prefix', { min: 1, max: 10 });
  
  if (settings.logChannelId) {
    validateDiscordId(settings.logChannelId, 'Log channel ID');
  }
  
  validateArraySize(settings.bannedWords, 'Banned words', { max: 500 });
  settings.bannedWords.forEach((word, index) => {
    validateStringLength(word, `Banned word[${index}]`, { min: 1, max: 100 });
  });
}
