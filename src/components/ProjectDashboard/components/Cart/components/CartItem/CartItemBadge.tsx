import { PropsWithChildren } from 'react'

export const CartItemBadge: React.FC<PropsWithChildren> = ({ children }) => (
  <span className="rounded-2xl bg-grey-100 py-0.5 px-2 dark:bg-slate-500 dark:text-slate-100">
    {children}
  </span>
)
