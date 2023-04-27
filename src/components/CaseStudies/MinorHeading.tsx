import { PropsWithChildren } from 'react'
import { classNames } from 'utils/classNames'

export function MinorHeading({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={classNames(
        'text-sm font-medium uppercase',
        'text-secondary',
        className,
      )}
    >
      <span>{children}</span>
    </div>
  )
}
