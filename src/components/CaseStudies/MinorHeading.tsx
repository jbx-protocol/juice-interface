import { PropsWithChildren } from 'react'
import { classNames } from 'utils/classNames'

export function MinorHeading({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={classNames(
        'text-sm uppercase',
        'text-grey-500 dark:text-slate-300',
        className,
      )}
    >
      <span>{children}</span>
    </div>
  )
}
