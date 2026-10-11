-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "socialNotificationChannel" TEXT,
ADD COLUMN     "socialNotificationMessage" TEXT NOT NULL DEFAULT '🔴 {user} is now live on {platform}!
{url}',
ADD COLUMN     "socialNotificationRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "socialNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userId" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialAccount_guildId_idx" ON "SocialAccount"("guildId");

-- CreateIndex
CREATE INDEX "SocialAccount_platform_idx" ON "SocialAccount"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_guildId_platform_username_key" ON "SocialAccount"("guildId", "platform", "username");

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("discordId") ON DELETE CASCADE ON UPDATE CASCADE;
