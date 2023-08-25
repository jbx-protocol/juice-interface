import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export const CartItemBadge: React.FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <span
    className={twMerge(
      'whitespace-nowrap rounded-2xl bg-grey-100 py-0.5 px-2 text-xs font-normal text-grey-700 dark:bg-slate-500 dark:text-slate-100',
      className,
    )}
  >
    {children}
  </span>
)
