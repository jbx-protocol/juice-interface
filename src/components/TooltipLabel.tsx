import { TooltipProps } from 'antd'
import { ReactNode } from 'react'
import { classNames } from 'utils/classNames'

import { twMerge } from 'tailwind-merge'
import TooltipIcon from './TooltipIcon'

export default function TooltipLabel({
  className,
  innerClassName,
  label,
  tip,
  placement,
}: {
  className?: string
  innerClassName?: string
  label: string | JSX.Element
  tip?: string | JSX.Element | ReactNode
  placement?: TooltipProps['placement']
}) {
  return (
    <span className={twMerge('flex items-center', className)}>
      <span className={classNames(tip ? 'mr-1' : 'mr-0')}>{label}</span>
      {tip && (
        <TooltipIcon
          className={innerClassName}
          tip={tip}
          placement={placement}
        />
      )}
    </span>
  )
}
