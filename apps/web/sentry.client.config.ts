import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Environment
  environment: process.env.NODE_ENV,

  // Security: Don't send sensitive data
  beforeSend(event, hint) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
      delete event.request.headers['authorization'];
      delete event.request.headers['Cookie'];
      delete event.request.headers['cookie'];
      delete event.request.headers['X-API-Key'];
      delete event.request.headers['x-api-key'];
    }

    // Remove sensitive cookies
    if (event.request?.cookies) {
      event.request.cookies = {};
    }

    // Scrub sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.data) {
          // Remove passwords, tokens, secrets
          const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'api_key'];
          sensitiveKeys.forEach(key => {
            if (key in breadcrumb.data!) {
              breadcrumb.data![key] = '[Filtered]';
            }
          });
        }
        return breadcrumb;
      });
    }

    return event;
  },

  // Ignore known errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    
    // Network errors
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    
    // User cancellations
    'AbortError',
    'Request aborted',
  ],

  // Performance
  integrations: [
    Sentry.replayIntegration({
      // Mask all text and input by default
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
