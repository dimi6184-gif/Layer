-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "ticketTranscriptChannelId" TEXT,
ADD COLUMN     "ticketTranscriptEnabled" BOOLEAN NOT NULL DEFAULT false;
