import React, { Component, ErrorInfo, ReactNode } from 'react'
import * as Sentry from '@sentry/browser'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      tags: {
        client_side_exception: errorInfo.componentStack,
      },
    })

    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            height: '100vh',
            flexDirection: 'column',
            background: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1>Sorry.. there was an error</h1>
          <h3>
            Please log a bug in our{' '}
            <a
              href="https://discord.gg/6jXrJSyDFf"
              rel="noopener noreferrer"
              target="_blank"
            >
              Discord
            </a>{' '}
            if you're continuing to have issues
          </h3>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
