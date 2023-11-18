import { PropsWithChildren } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Callout } from './Callout'

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
