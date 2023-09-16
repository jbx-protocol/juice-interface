import { twMerge } from 'tailwind-merge'

export function PayoutsTableRow({
  children,
  className,
  highlighted,
}: React.PropsWithChildren<{ className?: string; highlighted?: boolean }>) {
  return (
    <div
      className={twMerge(
        'text-secondary grid grid-cols-2 items-center border-t border-smoke-200 text-xs dark:border-slate-600 md:grid-cols-[3fr,2fr]',
        highlighted ? 'bg-grey-50 dark:bg-slate-950' : null,
        className,
      )}
    >
      {children}
    </div>
  )
}
