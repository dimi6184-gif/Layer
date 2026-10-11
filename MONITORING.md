# 📊 Monitoring & Analytics Guide

## 🔍 Was wird überwacht?

### 1. Application Health
- Web App Uptime
- Bot Uptime
- Database Connection
- API Response Times

### 2. Business Metrics
- Aktive Guilds
- Team Members
- Social Accounts
- Stream Notifications gesendet
- AI Token Usage

### 3. Error Tracking
- Application Errors
- API Errors
- Database Errors
- Discord API Errors

---

## 📈 Built-in Analytics

### Audit Logs

Alle wichtigen Events werden in der `AuditLog` Tabelle gespeichert:

```typescript
// Verfügbare Actions:
- MODULE_TOGGLE
- COMMAND_EXECUTED
- MESSAGE_SENT
- AI_TOKENS_USED
- TEAM_MEMBER_INVITED
- TEAM_MEMBER_UPDATED
- TEAM_MEMBER_REMOVED
- TEAM_INVITE_ACCEPTED
- TEAM_INVITE_DECLINED
- SOCIAL_SETTINGS_UPDATED
- SOCIAL_ACCOUNT_ADDED
- SOCIAL_ACCOUNT_REMOVED
- SOCIAL_NOTIFICATION_SENT
```

### Analytics Queries

```sql
-- Aktive Guilds heute
SELECT COUNT(DISTINCT "guildId") 
FROM "AuditLog" 
WHERE "createdAt" >= NOW() - INTERVAL '24 hours';

-- Commands heute
SELECT COUNT(*) 
FROM "AuditLog" 
WHERE action = 'COMMAND_EXECUTED' 
AND "createdAt" >= NOW() - INTERVAL '24 hours';

-- AI Token Usage heute
SELECT SUM((metadata->>'tokens')::int) as total_tokens
FROM "AuditLog" 
WHERE action = 'AI_TOKENS_USED' 
AND "createdAt" >= NOW() - INTERVAL '24 hours';

-- Top Commands
SELECT 
  metadata->>'commandName' as command,
  COUNT(*) as count
FROM "AuditLog" 
WHERE action = 'COMMAND_EXECUTED'
AND "createdAt" >= NOW() - INTERVAL '7 days'
GROUP BY metadata->>'commandName'
ORDER BY count DESC
LIMIT 10;

-- Stream Notifications heute
SELECT COUNT(*) 
FROM "AuditLog" 
WHERE action = 'SOCIAL_NOTIFICATION_SENT' 
AND "createdAt" >= NOW() - INTERVAL '24 hours';

-- Aktivste Guilds
SELECT 
  "guildId",
  COUNT(*) as activity_count
FROM "AuditLog" 
WHERE "createdAt" >= NOW() - INTERVAL '7 days'
GROUP BY "guildId"
ORDER BY activity_count DESC
LIMIT 10;
```

---

## 🚨 Error Monitoring

### Application Errors

Alle Errors werden in der Console geloggt. Für Production empfehle ich:

#### Option 1: Sentry (Empfohlen)

```bash
npm install @sentry/nextjs @sentry/node
```

**Web App Setup** (`sentry.client.config.ts`):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Bot Setup** (`src/index.ts`):
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### Option 2: Custom Error Logging

```typescript
// lib/error-logger.ts
export async function logError(error: Error, context?: any) {
  console.error("[Error]", error);
  
  // Log to database
  await db.errorLog.create({
    data: {
      message: error.message,
      stack: error.stack,
      context: JSON.stringify(context),
      timestamp: new Date(),
    },
  });
  
  // Send to Discord webhook (optional)
  if (process.env.ERROR_WEBHOOK_URL) {
    await fetch(process.env.ERROR_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "🚨 Application Error",
          description: error.message,
          color: 0xff0000,
          fields: [
            { name: "Stack", value: error.stack?.slice(0, 1000) || "N/A" },
            { name: "Context", value: JSON.stringify(context) || "N/A" },
          ],
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  }
}
```

---

## 📊 Performance Monitoring

### Web App Performance

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const start = Date.now();
  
  const response = NextResponse.next();
  
  const duration = Date.now() - start;
  
  // Log slow requests
  if (duration > 1000) {
    console.warn(`[Slow Request] ${request.url} took ${duration}ms`);
  }
  
  response.headers.set("X-Response-Time", `${duration}ms`);
  
  return response;
}
```

### Database Performance

```sql
-- Slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## 🔔 Alerting

### Discord Webhook Alerts

```typescript
// lib/alerts.ts
export async function sendAlert(
  title: string,
  description: string,
  severity: "info" | "warning" | "error"
) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) return;
  
  const colors = {
    info: 0x3b82f6,
    warning: 0xf59e0b,
    error: 0xef4444,
  };
  
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: `${severity === "error" ? "🚨" : severity === "warning" ? "⚠️" : "ℹ️"} ${title}`,
        description,
        color: colors[severity],
        timestamp: new Date().toISOString(),
      }],
    }),
  });
}

// Usage
await sendAlert(
  "High Error Rate",
  "Error rate exceeded 5% in the last 5 minutes",
  "error"
);
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { db } from "@nexus/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database
    await db.$queryRaw`SELECT 1`;
    
    // Check bot (optional - via API)
    // const botStatus = await checkBotStatus();
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "up",
        // bot: botStatus ? "up" : "down",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
```

---

## 📱 Uptime Monitoring

### Option 1: UptimeRobot (Kostenlos)

1. Gehe zu https://uptimerobot.com
2. Erstelle einen Monitor für deine Website
3. Füge `/api/health` als Endpoint hinzu
4. Konfiguriere Alerts (Email, Discord, etc.)

### Option 2: Betterstack (Empfohlen)

1. Gehe zu https://betterstack.com
2. Erstelle einen Monitor
3. Füge deine Domain hinzu
4. Konfiguriere Alerts

### Option 3: Self-Hosted

```bash
# Simple cron job
*/5 * * * * curl -f https://yourdomain.com/api/health || echo "Health check failed" | mail -s "Alert" your@email.com
```

---

## 📈 Dashboard (Optional)

### Grafana + Prometheus

Für fortgeschrittenes Monitoring:

1. **Prometheus** für Metrics Collection
2. **Grafana** für Visualisierung
3. **Loki** für Log Aggregation

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

volumes:
  prometheus_data:
  grafana_data:
```

---

## 🎯 Key Metrics to Track

### Application Metrics
- ✅ Request Rate (requests/minute)
- ✅ Error Rate (errors/minute)
- ✅ Response Time (p50, p95, p99)
- ✅ Uptime (%)

### Business Metrics
- ✅ Active Guilds (daily, weekly, monthly)
- ✅ Commands Executed (per day)
- ✅ AI Token Usage (per day)
- ✅ Stream Notifications Sent (per day)
- ✅ New Team Members (per day)

### Infrastructure Metrics
- ✅ CPU Usage (%)
- ✅ Memory Usage (%)
- ✅ Disk Usage (%)
- ✅ Database Connections
- ✅ Database Query Time

---

## 🔧 Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Check uptime status
- [ ] Review slow queries

### Weekly
- [ ] Review analytics
- [ ] Check disk space
- [ ] Review security logs

### Monthly
- [ ] Database backup verification
- [ ] Performance review
- [ ] Cost analysis
- [ ] Update dependencies

---

## 📞 Support

Bei Problemen:
1. Prüfe Health Check: `/api/health`
2. Prüfe Logs: `pm2 logs`
3. Prüfe Database: `psql -U postgres -d discord_bot`
4. Prüfe Audit Logs in der Datenbank
