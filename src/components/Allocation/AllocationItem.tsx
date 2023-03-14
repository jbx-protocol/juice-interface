import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export const AllocationItem = ({
  className,
  title,
  amount,
  extra,
  onClick,
}: {
  className?: string
  title: ReactNode
  amount: ReactNode
  extra?: ReactNode
  onClick?: VoidFunction
}) => {
  const isClickable = !!onClick

  return (
    <div
      className={twMerge(
        'select-none rounded-lg border border-solid border-smoke-200 bg-smoke-75 dark:border-slate-300 dark:bg-slate-400',
        'grid grid-cols-2 py-4 md:grid-cols-12 md:py-0',
        isClickable
          ? 'cursor-pointer transition-colors hover:border-smoke-400 dark:hover:border-slate-100'
          : '',
        className,
      )}
      onClick={onClick}
    >
      <div className="pb-3 pr-3 pl-7 md:col-span-6 md:py-3">{title}</div>
      <div className="justify-self-end pr-3 md:col-start-12 md:py-3">
        {extra}
      </div>
      <div
        className={twMerge(
          'col-span-2 border-t border-l-0 border-r-0 border-b-0 border-solid border-smoke-200 pt-3 pr-3 pl-7',
          'md:col-span-5 md:col-start-7 md:row-start-1 md:w-full md:justify-self-end md:border-l md:border-t-0 md:text-end',
          'dark:border-slate-300',
        )}
      >
        {amount}
      </div>
    </div>
  )
}
