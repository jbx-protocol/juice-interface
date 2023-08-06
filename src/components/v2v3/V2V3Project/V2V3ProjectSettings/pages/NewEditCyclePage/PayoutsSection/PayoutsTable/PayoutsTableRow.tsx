import { twMerge } from 'tailwind-merge'

export function PayoutsTableRow({
  children,
  className,
  highlighted,
}: React.PropsWithChildren<{ className?: string; highlighted?: boolean }>) {
  return (
    <tr
      className={twMerge(
        'text-secondary rounded-b-lg border-b border-smoke-200 text-xs dark:border-grey-600',
        highlighted ? 'bg-grey-50 dark:bg-grey-900' : null,
        className,
      )}
    >
      {children}
    </tr>
  )
}
