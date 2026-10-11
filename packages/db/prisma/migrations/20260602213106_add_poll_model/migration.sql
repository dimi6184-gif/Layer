-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "votes" JSONB NOT NULL DEFAULT '[]',
    "ended" BOOLEAN NOT NULL DEFAULT false,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poll_messageId_key" ON "Poll"("messageId");

-- CreateIndex
CREATE INDEX "Poll_guildId_idx" ON "Poll"("guildId");

-- CreateIndex
CREATE INDEX "Poll_messageId_idx" ON "Poll"("messageId");

-- CreateIndex
CREATE INDEX "Poll_createdAt_idx" ON "Poll"("createdAt");
