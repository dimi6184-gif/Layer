import { db } from "@nexus/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - startTime;
    
    // 🔒 SECURITY: Don't expose internal stats in production
    const includeStats = process.env.NODE_ENV === 'development';
    const stats = includeStats ? {
      guilds: await db.guild.count(),
      activeTeamMembers: await db.teamMember.count({ where: { status: "active" } }),
    } : undefined;
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: "up",
          responseTime: `${dbResponseTime}ms`,
        },
        application: {
          status: "up",
          version: process.env.npm_package_version || "1.0.0",
        },
      },
      ...(stats && { stats }),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("[Health Check] Error:", error);
    }
    
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          database: {
            status: "down",
          },
          application: {
            status: "up",
          },
        },
      },
      { status: 503 }
    );
  }
}
