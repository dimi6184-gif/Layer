// apps/web/src/app/api/fingerprint/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyBotApiAuth } from '@/lib/bot-api-auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // 🔒 SECURITY: Bot-only endpoint - verify bot authentication
    const authResult = verifyBotApiAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, guildId, fingerprint, components } = body;

    if (!userId || !guildId || !fingerprint) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store/update fingerprint
    await prisma.userFingerprint.upsert({
      where: {
        userId_guildId: {
          userId,
          guildId,
        },
      },
      update: {
        fingerprint,
        fingerprintData: components || {},
        verified: true,
        verifiedAt: new Date(),
        lastSeen: new Date(),
      },
      create: {
        userId,
        guildId,
        fingerprint,
        fingerprintData: components || {},
        verified: true,
        verifiedAt: new Date(),
        commonEmojis: [],
        commonWords: [],
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Fingerprint verified successfully',
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Fingerprint Verify API] Error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
