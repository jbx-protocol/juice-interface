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
        'w-10 h-10 min-w-[2.5rem] text-xl rounded-full flex justify-center items-center',
        isDefocused
          ? 'bg-smoke-100 dark:bg-slate-600 fill-smoke-400 dark:fill-slate-400 text-smoke-400 dark:text-slate-400'
          : 'bg-haze-100 dark:bg-haze-800 fill-haze-400 text-haze-400',
      )}
    >
      {icon}
    </div>
  )
}
