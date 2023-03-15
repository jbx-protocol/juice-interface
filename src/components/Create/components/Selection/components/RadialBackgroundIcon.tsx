import { ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export const RadialBackgroundIcon = ({
  icon,
  isDefocused,
}: {
  icon: ReactNode
  isDefocused: boolean
}) => {
  return (
    <div
      className={classNames(
        'flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-full text-xl',
        isDefocused
          ? 'bg-smoke-100 fill-smoke-400 text-smoke-400 dark:bg-slate-600 dark:fill-slate-400 dark:text-slate-400'
          : 'bg-bluebs-100 fill-bluebs-500 text-bluebs-500 dark:bg-bluebs-800',
      )}
    >
      {icon}
    </div>
  )
}
