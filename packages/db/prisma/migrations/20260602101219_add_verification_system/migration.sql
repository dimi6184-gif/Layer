-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "verificationButtonEmoji" TEXT NOT NULL DEFAULT '✅',
ADD COLUMN     "verificationButtonLabel" TEXT NOT NULL DEFAULT 'Verify Me',
ADD COLUMN     "verificationCaptchaEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "verificationChannelId" TEXT,
ADD COLUMN     "verificationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationLogChannelId" TEXT,
ADD COLUMN     "verificationPanelColor" TEXT NOT NULL DEFAULT '#10b981',
ADD COLUMN     "verificationPanelDescription" TEXT NOT NULL DEFAULT 'Welcome to the server!

Click the button below to verify yourself and gain access to the server.',
ADD COLUMN     "verificationPanelTitle" TEXT NOT NULL DEFAULT '🔒 Server Verification',
ADD COLUMN     "verificationRoleId" TEXT;
