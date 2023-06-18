import { PropsWithChildren, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

export type BadgeVariant = 'warning' | 'danger' | 'success' | 'info' | 'default'

export function Badge({
  className,
  upperCase,
  children,
  variant,
  fill,
  clickable,
  size = 'middle',
  ...props
}: PropsWithChildren<{
  className?: string
  variant: BadgeVariant
  upperCase?: boolean
  fill?: boolean
  clickable?: boolean
  size?: 'small' | 'middle'
}> &
  React.HTMLAttributes<HTMLSpanElement>) {
  const badgeClasses = useMemo(() => {
    // TODO add fills for other variants
    switch (variant) {
      case 'warning':
        return 'bg-warning-200 text-warning-800 dark:bg-warning-800 dark:text-warning-200'
      case 'danger':
        return 'bg-split-200 text-split-800 dark:bg-split-800 dark:text-split-200'
      case 'info':
        return 'bg-bluebs-100 text-bluebs-500 dark:bg-bluebs-800 dark:text-bluebs-300'
      case 'success':
        return 'bg-melon-50 text-melon-700 dark:bg-melon-950 dark:text-melon-600'
      case 'default':
        return twMerge(
          'border-smoke-200 dark:border-slate-400 border border-solid',
          fill
            ? 'bg-smoke-200 text-smoke-800 dark:bg-slate-600 dark:text-slate-100'
            : 'bg-white dark:bg-slate-900 text-smoke-700 dark:text-slate-200',
          props.onClick || clickable
            ? 'hover:bg-smoke-50 dark:hover:bg-slate-700'
            : '',
        )
    }
  }, [variant, fill, props.onClick, clickable])

  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'small':
        return 'py-0.5 px-2 text-xs leading-tight'
      default:
        return 'py-0.5 px-3 text-sm'
    }
  }, [size])

  return (
    <span
      className={twMerge(
        'flex items-center justify-center gap-1 rounded-full font-normal transition-colors',
        upperCase ? 'uppercase' : '',
        badgeClasses,
        sizeClasses,
        className,
      )}
      role={props.onClick ? 'button' : undefined}
      {...props}
    >
      {children}
    </span>
  )
}
