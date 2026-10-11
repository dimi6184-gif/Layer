-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "globalTrust" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT '!',
    "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
    "personality" TEXT,
    "moderationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "levelingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "musicEnabled" BOOLEAN NOT NULL DEFAULT false,
    "djRoleIds" TEXT[],
    "bannedWords" TEXT[],
    "antiSpamEnabled" BOOLEAN NOT NULL DEFAULT false,
    "antiScamEnabled" BOOLEAN NOT NULL DEFAULT false,
    "scamSensitivity" TEXT NOT NULL DEFAULT 'medium',
    "logChannelId" TEXT,
    "levelUpChannelId" TEXT,
    "levelRewards" JSONB,
    "ticketsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "ticketCategoryId" TEXT,
    "ticketSupportRoleIds" TEXT[],
    "ticketPanelTitle" TEXT NOT NULL DEFAULT '🎫 Support Tickets',
    "ticketPanelDescription" TEXT NOT NULL DEFAULT 'Need help or have a question?

Click the button below to open a **private support ticket**. Our team will be with you shortly.',
    "ticketPanelColor" TEXT NOT NULL DEFAULT '#6366f1',
    "ticketButtonLabel" TEXT NOT NULL DEFAULT 'Open a Ticket',
    "ticketButtonEmoji" TEXT NOT NULL DEFAULT '🎫',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "coins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GuildMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_discordId_key" ON "Guild"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "GuildMember_userId_guildId_key" ON "GuildMember"("userId", "guildId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("discordId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildMember" ADD CONSTRAINT "GuildMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildMember" ADD CONSTRAINT "GuildMember_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
