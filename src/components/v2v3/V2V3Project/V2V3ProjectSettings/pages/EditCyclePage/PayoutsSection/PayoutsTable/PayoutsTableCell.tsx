import { twMerge } from 'tailwind-merge'

export function PayoutsTableCell({
  children,
  className,
  colSpan = 1,
}: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
  return (
    <div className={twMerge(`px-6 py-3.5 col-span-${colSpan}`, className)}>
      {children}
    </div>
  )
}
