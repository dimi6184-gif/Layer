-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "TeamMember_status_idx" ON "TeamMember"("status");
