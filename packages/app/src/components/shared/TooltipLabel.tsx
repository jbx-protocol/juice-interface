import { TooltipProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

import TooltipIcon from './TooltipIcon'

export default function TooltipLabel({
  label,
  tip,
  placement,
  style,
}: {
  label: string | JSX.Element
  tip?: string
  placement?: TooltipProps['placement']
  style?: CSSProperties
}) {
  const { colors } = useContext(ThemeContext).theme

  return (
    <span style={style}>
      <span style={{ marginRight: tip ? 5 : 0 }}>{label}</span>
      {tip && <TooltipIcon tip={tip} placement={placement} />}
    </span>
  )
}
