-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "customGiveawayEmoji" TEXT NOT NULL DEFAULT '🎉',
ADD COLUMN     "customPollEmojis" TEXT[] DEFAULT ARRAY['1️⃣', '2️⃣', '3️⃣', '4️⃣']::TEXT[];
