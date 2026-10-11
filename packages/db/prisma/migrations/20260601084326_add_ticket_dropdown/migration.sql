-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "ticketReasons" JSONB,
ADD COLUMN     "ticketUseDropdown" BOOLEAN NOT NULL DEFAULT false;
