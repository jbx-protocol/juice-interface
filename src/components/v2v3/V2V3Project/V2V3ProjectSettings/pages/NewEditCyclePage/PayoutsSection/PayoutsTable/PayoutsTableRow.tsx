import { twMerge } from 'tailwind-merge'

export function PayoutsTableRow({
  children,
  className,
  highlighted,
}: React.PropsWithChildren<{ className?: string; highlighted?: boolean }>) {
  return (
    <div
      className={twMerge(
        'text-secondary grid grid-cols-[3fr,2fr] items-center border-t border-smoke-200 text-xs dark:border-grey-600',
        highlighted ? 'bg-grey-50 dark:bg-grey-900' : null,
        className,
      )}
    >
      {children}
    </div>
  )
}
