import { AriaRole, MouseEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  className?: string
  children?: React.ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
  role?: AriaRole
  as?: React.ElementType
}
export const DisplayCard: React.FC<Props> = ({
  className,
  children,
  onClick,
  role,
  as: Component = 'div',
}) => {
  return (
    <Component
      className={twMerge(
        'rounded-lg bg-smoke-50 py-5 px-6 dark:bg-slate-700',
        className,
      )}
      role={role}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}
