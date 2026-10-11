-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "autoRoleIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "leaveChannelId" TEXT,
ADD COLUMN     "leaveEmbedColor" TEXT NOT NULL DEFAULT '#ef4444',
ADD COLUMN     "leaveEmbedDescription" TEXT NOT NULL DEFAULT '{user} has left the server.',
ADD COLUMN     "leaveEmbedEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "leaveEmbedTitle" TEXT NOT NULL DEFAULT 'Goodbye 👋',
ADD COLUMN     "leaveEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leaveMessage" TEXT,
ADD COLUMN     "welcomeChannelId" TEXT,
ADD COLUMN     "welcomeDMEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "welcomeDMMessage" TEXT,
ADD COLUMN     "welcomeEmbedColor" TEXT NOT NULL DEFAULT '#5865F2',
ADD COLUMN     "welcomeEmbedDescription" TEXT NOT NULL DEFAULT 'Hey {user}, welcome to **{server}**!

You are member **#{memberCount}**!',
ADD COLUMN     "welcomeEmbedEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "welcomeEmbedTitle" TEXT NOT NULL DEFAULT 'Welcome to {server}! 👋',
ADD COLUMN     "welcomeEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "welcomeImageEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "welcomeMessage" TEXT;
