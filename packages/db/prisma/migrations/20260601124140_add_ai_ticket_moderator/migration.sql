-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "aiTicketAutoDelay" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "aiTicketBlacklist" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "aiTicketConfidenceMin" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "aiTicketEscalateAfter" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "aiTicketEscalateRoleId" TEXT,
ADD COLUMN     "aiTicketKnowledgeBase" JSONB,
ADD COLUMN     "aiTicketLanguage" TEXT NOT NULL DEFAULT 'auto',
ADD COLUMN     "aiTicketMaxMessages" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "aiTicketModeratorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiTicketPersonality" TEXT,
ADD COLUMN     "aiTicketWhitelist" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isAI" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketAnalytics" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "category" TEXT,
    "priority" TEXT,
    "aiHandled" BOOLEAN NOT NULL DEFAULT false,
    "aiResolved" BOOLEAN NOT NULL DEFAULT false,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "escalationReason" TEXT,
    "responseTime" INTEGER,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "aiMessageCount" INTEGER NOT NULL DEFAULT 0,
    "userSatisfaction" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "TicketAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TicketMessage_guildId_ticketId_idx" ON "TicketMessage"("guildId", "ticketId");

-- CreateIndex
CREATE INDEX "TicketMessage_ticketId_createdAt_idx" ON "TicketMessage"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "TicketAnalytics_guildId_createdAt_idx" ON "TicketAnalytics"("guildId", "createdAt");

-- CreateIndex
CREATE INDEX "TicketAnalytics_ticketId_idx" ON "TicketAnalytics"("ticketId");

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("discordId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketAnalytics" ADD CONSTRAINT "TicketAnalytics_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("discordId") ON DELETE CASCADE ON UPDATE CASCADE;
