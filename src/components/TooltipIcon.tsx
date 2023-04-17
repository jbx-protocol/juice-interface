import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip, TooltipProps } from 'antd'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export default function TooltipIcon({
  className,
  tip,
  placement,
  iconClassName,
}: {
  className?: string // overlayClassName
  tip?: string | JSX.Element | ReactNode
  placement?: TooltipProps['placement']
  iconClassName?: string
}) {
  return (
    <Tooltip
      title={tip}
      placement={placement}
      trigger={['hover', 'click']}
      overlayClassName={className}
    >
      <QuestionMarkCircleIcon
        className={twMerge('inline h-4 w-4 text-current', iconClassName)}
      />
    </Tooltip>
  )
}
