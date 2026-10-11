/*
  Warnings:

  - You are about to drop the column `aiTicketEscalateRoleId` on the `Guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "aiTicketEscalateRoleId",
ADD COLUMN     "aiTicketEscalateRoleIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
