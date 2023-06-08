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
    <div className="flex flex-col gap-1 text-end" {...props}>
      <span className="text-sm font-medium uppercase text-grey-500 dark:text-slate-200">
        {label}
      </span>
      <span className="text-medium font-display text-4xl dark:text-slate-50">
        {stat}
      </span>
    </div>
  )
}
