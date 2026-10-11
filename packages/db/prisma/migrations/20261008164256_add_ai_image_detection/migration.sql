-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "aiDetectionAction" TEXT NOT NULL DEFAULT 'log',
ADD COLUMN     "aiDetectionDeleteChannelIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "aiDetectionLogChannelId" TEXT,
ADD COLUMN     "aiDetectionRequireLabel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiDetectionThreshold" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "aiDetectionWhitelistRoleIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "aiImageDetectionEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AIImageDetection" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "aiLabels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "actionTaken" TEXT NOT NULL DEFAULT 'log',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIImageDetection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIImageDetection_guildId_detectedAt_idx" ON "AIImageDetection"("guildId", "detectedAt");

-- CreateIndex
CREATE INDEX "AIImageDetection_guildId_confidence_idx" ON "AIImageDetection"("guildId", "confidence");

-- CreateIndex
CREATE INDEX "AIImageDetection_messageId_idx" ON "AIImageDetection"("messageId");
