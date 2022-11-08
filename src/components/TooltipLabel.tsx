import { TooltipProps } from 'antd'
import { CSSProperties, ReactNode } from 'react'

import TooltipIcon from './TooltipIcon'

export default function TooltipLabel({
  label,
  tip,
  placement,
  style,
  tooltipInnerStyle,
}: {
  label: string | JSX.Element
  tip?: string | JSX.Element | ReactNode
  placement?: TooltipProps['placement']
  style?: CSSProperties
  tooltipInnerStyle?: CSSProperties
}) {
  return (
    <span style={style}>
      <span style={{ marginRight: tip ? 5 : 0 }}>{label}</span>
      {tip && (
        <TooltipIcon
          tip={tip}
          placement={placement}
          tooltipInnerStyle={tooltipInnerStyle}
        />
      )}
    </span>
  )
}
