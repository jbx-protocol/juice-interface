import { ErrorBoundary } from '@sentry/nextjs'
import { PropsWithChildren } from 'react'
import { Callout } from './Callout'

export function ErrorBoundaryCallout({
  children,
  message,
}: PropsWithChildren<{ message: string | JSX.Element }>) {
  return (
    <ErrorBoundary
      fallback={<Callout.Warning iconSize="small">{message}</Callout.Warning>}
    >
      {children}
    </ErrorBoundary>
  )
}
