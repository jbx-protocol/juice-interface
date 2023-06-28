import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'

export const ProjectHeaderStat = ({
  label,
  stat,
  ...props
}: {
  label: ReactNode
  stat: ReactNode
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div className="flex flex-col gap-1" {...props}>
      <span className="text-xs font-medium uppercase text-grey-500 dark:text-slate-200 md:text-sm">
        {label}
      </span>
      <span className="text-medium font-display text-2xl text-grey-900  dark:text-slate-50 md:text-4xl">
        {stat}
      </span>
    </div>
  )
}
