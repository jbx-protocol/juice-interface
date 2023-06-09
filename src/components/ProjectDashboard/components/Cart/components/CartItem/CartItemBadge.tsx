import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export const CartItemBadge: React.FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <span
    className={twMerge(
      'rounded-2xl bg-grey-100 py-0.5 px-2 dark:bg-slate-500 dark:text-slate-100',
      className,
    )}
  >
    {children}
  </span>
)
