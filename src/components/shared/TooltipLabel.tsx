import { TooltipProps } from 'antd'
import { CSSProperties } from 'react'

import TooltipIcon from './TooltipIcon'

export default function TooltipLabel({
  label,
  tip,
  placement,
  style,
}: {
  label: string | JSX.Element
  tip?: string | JSX.Element
  placement?: TooltipProps['placement']
  style?: CSSProperties
}) {
  return (
    <span style={style}>
      <span style={{ marginRight: tip ? 5 : 0 }}>{label}</span>
      {tip && <TooltipIcon tip={tip} placement={placement} />}
    </span>
  )
}
