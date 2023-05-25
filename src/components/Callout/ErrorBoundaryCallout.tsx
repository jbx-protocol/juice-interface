import { ErrorBoundary } from '@sentry/nextjs'
import { PropsWithChildren } from 'react'
import { Callout } from '.'

export function ErrorBoundaryCallout({
  children,
  message,
}: PropsWithChildren<{ message: string | JSX.Element }>) {
  return (
    <ErrorBoundary
      fallback={
        <Callout.Warning className="max-h-14" iconSize="small">
          {message}
        </Callout.Warning>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
