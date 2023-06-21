import { Tooltip } from 'antd'
import { AriaRole, MouseEventHandler, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from './DisplayCard'

type Props = {
  title: ReactNode
  description: ReactNode | undefined
  tooltip?: ReactNode
  className?: string
  children?: React.ReactNode
  role?: AriaRole
  as?: React.ElementType
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
  onFocus?: MouseEventHandler<HTMLDivElement>
  onClick?: MouseEventHandler<HTMLDivElement>
}
export const TitleDescriptionDisplayCard = ({
  title,
  description,
  tooltip,
  className,
  children,
  ...rest
}: Props) => {
  return (
    <DisplayCard className={twMerge(className)} {...rest}>
      <div className="flex w-full flex-col gap-2">
        <Tooltip title={tooltip}>
          <span className="max-w-min whitespace-nowrap font-body text-sm font-medium text-grey-600 dark:text-slate-200">
            {title}
          </span>
        </Tooltip>
        <span className="truncate font-heading text-xl font-medium dark:text-slate-50">
          {description}
        </span>
      </div>
      {children}
    </DisplayCard>
  )
}
