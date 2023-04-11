import { PropsWithChildren, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

export type BadgeVariant = 'warning' | 'danger' | 'info' | 'tertiary'

export function Badge({
  className,
  upperCase,
  children,
  variant,
}: PropsWithChildren<{
  className?: string
  variant: BadgeVariant
  upperCase?: boolean
}>) {
  const badgeClasses = useMemo(() => {
    switch (variant) {
      case 'warning':
        return 'bg-warning-200 text-warning-800 dark:bg-warning-800 dark:text-warning-200 dark:border-warning-200'
      case 'danger':
        return 'bg-error-200 text-error-800 dark:bg-error-800 dark:text-error-200 dark:border-error-200'
      case 'info':
        return 'bg-bluebs-100 text-bluebs-500 dark:bg-bluebs-800 dark:text-bluebs-300 dark:border-bluebs-300'
      case 'tertiary':
        return 'bg-smoke-100 text-smoke-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-200'
    }
  }, [variant])

  return (
    <span
      className={twMerge(
        className,
        'rounded-xl py-[0.1rem] px-2 text-xs font-normal dark:border',
        upperCase ? 'uppercase' : '',
        badgeClasses,
      )}
    >
      {children}
    </span>
  )
}
