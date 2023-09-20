import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from 'antd'
import { AriaRole, MouseEventHandler, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { PopupMenu, PopupMenuProps } from '../../../../../ui/PopupMenu'
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
  const hasKebabMenu = !!kebabMenu?.items.length
  return (
    <DisplayCard className={twMerge(className)} {...rest}>
      <div className="w-full">
        <div className="flex flex-1 items-center justify-between">
          <Tooltip title={tooltip}>
            <span className="inline-flex max-w-min items-center gap-1 whitespace-nowrap font-body text-sm font-medium text-grey-600 dark:text-slate-200">
              <span className={tooltip ? 'leading-none' : undefined}>
                {title}
              </span>
              {!!tooltip && (
                <QuestionMarkCircleIcon className="h-4 w-4 text-grey-500 dark:text-slate-200" />
              )}
            </span>
          </Tooltip>
          {hasKebabMenu && <PopupMenu {...kebabMenu} />}
        </div>
        {description && (
          <div className="mt-2 truncate font-heading text-xl font-medium dark:text-slate-50">
            {description}
          </div>
        )}
      </div>
      {children}
    </DisplayCard>
  )
}
