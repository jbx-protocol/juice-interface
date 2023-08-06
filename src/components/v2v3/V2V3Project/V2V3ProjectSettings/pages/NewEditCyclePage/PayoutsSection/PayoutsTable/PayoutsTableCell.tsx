import { twMerge } from 'tailwind-merge'

export function PayoutsTableCell({
  children,
  className,
  colSpan = 1,
}: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
  return (
    <td className={twMerge('px-6 py-3.5', className)} colSpan={colSpan}>
      {children}
    </td>
  )
}
