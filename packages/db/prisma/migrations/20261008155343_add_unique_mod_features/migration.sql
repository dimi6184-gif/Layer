-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "avatarHistoryLimit" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "avatarLogChannelId" TEXT,
ADD COLUMN     "avatarTrackingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "banEvasionAutoAction" TEXT NOT NULL DEFAULT 'alert',
ADD COLUMN     "banEvasionConfidenceMin" INTEGER NOT NULL DEFAULT 85,
ADD COLUMN     "banEvasionEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "banEvasionLogChannelId" TEXT,
ADD COLUMN     "banEvasionRequireVerification" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "banEvasionWhitelistRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ghostCleanerEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ghostInactiveDays" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "ghostKickEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ghostLogChannelId" TEXT,
ADD COLUMN     "ghostWarnBeforeKick" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ghostWarningDays" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "ghostWhitelistRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "impersonationAutoAction" TEXT NOT NULL DEFAULT 'nickname',
ADD COLUMN     "impersonationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "impersonationLogChannelId" TEXT,
ADD COLUMN     "impersonationSensitivity" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "protectedUserIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "UserFingerprint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "fingerprintData" JSONB,
    "avgTypingSpeed" DOUBLE PRECISION,
    "avgMessageLength" DOUBLE PRECISION,
    "commonEmojis" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "commonWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "activityPattern" JSONB,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fingerprint" TEXT,
    "fingerprintData" JSONB,
    "behavioralData" JSONB,
    "reason" TEXT,
    "bannedBy" TEXT NOT NULL,
    "bannedByName" TEXT NOT NULL,
    "evasionAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanEvasionDetection" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "suspectUserId" TEXT NOT NULL,
    "suspectUsername" TEXT NOT NULL,
    "bannedUserId" TEXT NOT NULL,
    "bannedUsername" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "fingerprintMatch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "behavioralMatch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "networkMatch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "signals" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewedByName" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "actionTaken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BanEvasionDetection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageLength" INTEGER NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "emojis" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mentions" INTEGER NOT NULL DEFAULT 0,
    "typingSpeed" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "timeSinceLast" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "avatarHash" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvatarHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "avatarHash" TEXT,
    "protected" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpersonationDetection" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "suspectUserId" TEXT NOT NULL,
    "suspectUsername" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "targetUsername" TEXT NOT NULL,
    "similarityScore" DOUBLE PRECISION NOT NULL,
    "usernameSimilarity" DOUBLE PRECISION NOT NULL,
    "avatarSimilarity" DOUBLE PRECISION,
    "matchReasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "actionTaken" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImpersonationDetection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InactiveMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "lastVoiceAt" TIMESTAMP(3),
    "voiceMinutes" INTEGER NOT NULL DEFAULT 0,
    "isInactive" BOOLEAN NOT NULL DEFAULT false,
    "inactiveDays" INTEGER NOT NULL DEFAULT 0,
    "isWhitelisted" BOOLEAN NOT NULL DEFAULT false,
    "whitelistReason" TEXT,
    "kickScheduled" BOOLEAN NOT NULL DEFAULT false,
    "kickScheduledAt" TIMESTAMP(3),
    "kickWarned" BOOLEAN NOT NULL DEFAULT false,
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InactiveMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserFingerprint_guildId_idx" ON "UserFingerprint"("guildId");

-- CreateIndex
CREATE INDEX "UserFingerprint_fingerprint_idx" ON "UserFingerprint"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "UserFingerprint_userId_guildId_key" ON "UserFingerprint"("userId", "guildId");

-- CreateIndex
CREATE INDEX "BannedUser_guildId_idx" ON "BannedUser"("guildId");

-- CreateIndex
CREATE INDEX "BannedUser_fingerprint_idx" ON "BannedUser"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "BannedUser_userId_guildId_key" ON "BannedUser"("userId", "guildId");

-- CreateIndex
CREATE INDEX "BanEvasionDetection_guildId_status_idx" ON "BanEvasionDetection"("guildId", "status");

-- CreateIndex
CREATE INDEX "BanEvasionDetection_suspectUserId_idx" ON "BanEvasionDetection"("suspectUserId");

-- CreateIndex
CREATE INDEX "BanEvasionDetection_bannedUserId_idx" ON "BanEvasionDetection"("bannedUserId");

-- CreateIndex
CREATE INDEX "BanEvasionDetection_createdAt_idx" ON "BanEvasionDetection"("createdAt");

-- CreateIndex
CREATE INDEX "MessageAnalytics_userId_guildId_idx" ON "MessageAnalytics"("userId", "guildId");

-- CreateIndex
CREATE INDEX "MessageAnalytics_guildId_timestamp_idx" ON "MessageAnalytics"("guildId", "timestamp");

-- CreateIndex
CREATE INDEX "AvatarHistory_userId_guildId_idx" ON "AvatarHistory"("userId", "guildId");

-- CreateIndex
CREATE INDEX "AvatarHistory_userId_detectedAt_idx" ON "AvatarHistory"("userId", "detectedAt");

-- CreateIndex
CREATE INDEX "AvatarHistory_guildId_idx" ON "AvatarHistory"("guildId");

-- CreateIndex
CREATE INDEX "StaffProfile_guildId_idx" ON "StaffProfile"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffProfile_userId_guildId_key" ON "StaffProfile"("userId", "guildId");

-- CreateIndex
CREATE INDEX "ImpersonationDetection_guildId_status_idx" ON "ImpersonationDetection"("guildId", "status");

-- CreateIndex
CREATE INDEX "ImpersonationDetection_suspectUserId_idx" ON "ImpersonationDetection"("suspectUserId");

-- CreateIndex
CREATE INDEX "ImpersonationDetection_targetUserId_idx" ON "ImpersonationDetection"("targetUserId");

-- CreateIndex
CREATE INDEX "ImpersonationDetection_detectedAt_idx" ON "ImpersonationDetection"("detectedAt");

-- CreateIndex
CREATE INDEX "InactiveMember_guildId_isInactive_idx" ON "InactiveMember"("guildId", "isInactive");

-- CreateIndex
CREATE INDEX "InactiveMember_guildId_kickScheduled_idx" ON "InactiveMember"("guildId", "kickScheduled");

-- CreateIndex
CREATE UNIQUE INDEX "InactiveMember_userId_guildId_key" ON "InactiveMember"("userId", "guildId");
