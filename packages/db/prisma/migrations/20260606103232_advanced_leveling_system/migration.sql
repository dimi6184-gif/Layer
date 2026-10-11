-- AlterTable
ALTER TABLE "GuildMember" ADD COLUMN     "achievements" JSONB DEFAULT '[]',
ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActiveAt" TIMESTAMP(3),
ADD COLUMN     "totalMessages" INTEGER NOT NULL DEFAULT 0;
