import { AriaRole, MouseEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  className?: string
  children?: React.ReactNode
  role?: AriaRole
  as?: React.ElementType
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
  onFocus?: MouseEventHandler<HTMLDivElement>
  onClick?: MouseEventHandler<HTMLDivElement>
}
export const DisplayCard: React.FC<Props> = ({
  className,
  children,
  role,
  as: Component = 'div',
  ...rest
}) => {
  return (
    <Component
      className={twMerge(
        'rounded-lg bg-smoke-50 py-5 px-6 dark:bg-slate-700',
        className,
      )}
      role={role}
      {...rest}
    >
      {children}
    </Component>
  )
}
