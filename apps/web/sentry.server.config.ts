import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Security: Don't send sensitive data
  beforeSend(event, hint) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
      delete event.request.headers['x-api-key'];
      delete event.request.headers['x-bot-secret'];
    }

    // Remove query parameters that might contain tokens
    if (typeof event.request?.query_string === 'string') {
      const qs = event.request.query_string;
      const sensitiveParams = ['token', 'secret', 'apiKey', 'api_key'];
      sensitiveParams.forEach(param => {
        if (qs.includes(param)) {
          event.request!.query_string = '[Filtered]';
        }
      });
    }

    // Scrub sensitive data from extra context
    if (event.extra) {
      const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'api_key', 'discordToken'];
      Object.keys(event.extra).forEach(key => {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          event.extra![key] = '[Filtered]';
        }
      });
    }

    return event;
  },

  // Ignore known errors
  ignoreErrors: [
    'ECONNRESET',
    'ENOTFOUND',
    'ETIMEDOUT',
    'Prisma Client validation error',
  ],
});
