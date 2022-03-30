import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

export default function initSentry() {
  if (
    process.env.NODE_ENV === 'development' ||
    !process.env.REACT_APP_SENTRY_DSN
  )
    return

  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    environment: process.env.REACT_APP_INFURA_NETWORK,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
