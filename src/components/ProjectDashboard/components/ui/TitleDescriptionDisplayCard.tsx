import { Tooltip } from 'antd'
import { AriaRole, MouseEventHandler, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { PopupMenu, PopupMenuProps } from '../PopupMenu/PopupMenu'
import { DisplayCard } from './DisplayCard'

type Props = {
  title: ReactNode
  description?: ReactNode | undefined
  tooltip?: ReactNode
  kebabMenu?: PopupMenuProps
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
  kebabMenu,
  className,
  children,
  ...rest
}: Props) => {
  return (
    <DisplayCard className={twMerge(className)} {...rest}>
      <div className="flex w-full flex-col gap-2">
        <Tooltip
          className="flex items-center justify-between gap-3"
          title={tooltip}
        >
          <span className="max-w-min whitespace-nowrap font-body text-sm font-medium text-grey-600 dark:text-slate-200">
            {title}
          </span>
          {!!kebabMenu?.items.length && <PopupMenu {...kebabMenu} />}
        </Tooltip>
        {description && (
          <span className="truncate font-heading text-xl font-medium dark:text-slate-50">
            {description}
          </span>
        )}
      </div>
      {children}
    </DisplayCard>
  )
}
