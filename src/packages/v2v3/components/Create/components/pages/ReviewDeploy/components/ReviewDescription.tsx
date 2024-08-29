import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export const ReviewDescription = ({
  className,
  title,
  desc,
  placeholder = '-',
}: {
  className?: string
  title: ReactNode
  desc: ReactNode
  placeholder?: ReactNode
}) => {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <div
        className={
          'text-xs font-normal uppercase text-grey-600 dark:text-slate-200'
        }
      >
        {title}
      </div>
      <div>{desc ? desc : <i>{placeholder}</i>}</div>
    </div>
  )
}
