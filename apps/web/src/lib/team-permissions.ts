// Permission definitions
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "view_dashboard",
  
  // Modules
  MANAGE_MODULES: "manage_modules",
  
  // Moderation
  VIEW_MODERATION: "view_moderation",
  MANAGE_MODERATION: "manage_moderation",
  
  // Leveling
  VIEW_LEVELING: "view_leveling",
  MANAGE_LEVELING: "manage_leveling",
  
  // Music
  VIEW_MUSIC: "view_music",
  MANAGE_MUSIC: "manage_music",
  
  // Tickets
  VIEW_TICKETS: "view_tickets",
  MANAGE_TICKETS: "manage_tickets",
  
  // AI Settings
  VIEW_AI: "view_ai",
  MANAGE_AI: "manage_ai",
  
  // Anti-Scam
  VIEW_ANTISCAM: "view_antiscam",
  MANAGE_ANTISCAM: "manage_antiscam",
  
  // Team Management
  VIEW_TEAM: "view_team",
  MANAGE_TEAM: "manage_team",
  
  // Audit Logs
  VIEW_LOGS: "view_logs",
} as const;

// Role presets
export const ROLE_PRESETS = {
  owner: {
    name: "Owner",
    description: "Full access to everything",
    permissions: Object.values(PERMISSIONS),
  },
  admin: {
    name: "Admin",
    description: "Almost full access, cannot manage team",
    permissions: Object.values(PERMISSIONS).filter(p => p !== PERMISSIONS.MANAGE_TEAM),
  },
  moderator: {
    name: "Moderator",
    description: "Moderation, tickets, and anti-scam only",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MODERATION,
      PERMISSIONS.MANAGE_MODERATION,
      PERMISSIONS.VIEW_TICKETS,
      PERMISSIONS.MANAGE_TICKETS,
      PERMISSIONS.VIEW_ANTISCAM,
      PERMISSIONS.MANAGE_ANTISCAM,
      PERMISSIONS.VIEW_LOGS,
    ],
  },
  event_manager: {
    name: "Event Manager",
    description: "Manage events, giveaways, and announcements",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_LOGS,
    ],
  },
  support: {
    name: "Support",
    description: "Tickets and AI settings only",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_TICKETS,
      PERMISSIONS.MANAGE_TICKETS,
      PERMISSIONS.VIEW_AI,
      PERMISSIONS.MANAGE_AI,
    ],
  },
  viewer: {
    name: "Viewer",
    description: "Read-only access to everything",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_MODERATION,
      PERMISSIONS.VIEW_LEVELING,
      PERMISSIONS.VIEW_MUSIC,
      PERMISSIONS.VIEW_TICKETS,
      PERMISSIONS.VIEW_AI,
      PERMISSIONS.VIEW_ANTISCAM,
      PERMISSIONS.VIEW_TEAM,
      PERMISSIONS.VIEW_LOGS,
    ],
  },
} as const;
