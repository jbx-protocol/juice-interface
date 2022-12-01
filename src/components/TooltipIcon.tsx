import { QuestionCircleOutlined } from '@ant-design/icons'
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
      <QuestionCircleOutlined
        className={twMerge('text-black dark:text-slate-100', iconClassName)}
      />
    </Tooltip>
  )
}
