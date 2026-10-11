-- CreateTable
CREATE TABLE "Giveaway" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT,
    "hostId" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "description" TEXT,
    "winnerCount" INTEGER NOT NULL DEFAULT 1,
    "requiredRoleIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredLevel" INTEGER,
    "requireBoost" BOOLEAN NOT NULL DEFAULT false,
    "blacklistedRoleIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "duration" INTEGER NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "ended" BOOLEAN NOT NULL DEFAULT false,
    "winnerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "winnerNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "participants" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "color" TEXT NOT NULL DEFAULT '#5865F2',
    "thumbnailUrl" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Giveaway_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Giveaway_guildId_ended_idx" ON "Giveaway"("guildId", "ended");

-- CreateIndex
CREATE INDEX "Giveaway_endsAt_idx" ON "Giveaway"("endsAt");

-- CreateIndex
CREATE INDEX "Giveaway_messageId_idx" ON "Giveaway"("messageId");
