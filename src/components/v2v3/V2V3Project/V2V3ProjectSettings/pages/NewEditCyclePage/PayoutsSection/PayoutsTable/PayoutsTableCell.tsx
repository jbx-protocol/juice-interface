import { twMerge } from 'tailwind-merge'

export function PayoutsTableCell({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return <td className={twMerge('px-6 py-3.5', className)}>{children}</td>
}
