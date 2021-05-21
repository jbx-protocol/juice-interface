import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

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
    <span>
      <span style={{ ...style, marginRight: 5 }}>{label}</span>
      {tip ? (
        <Tooltip title={tip} placement={placement}>
          <InfoCircleOutlined style={{ color: colors.icon.secondary }} />
        </Tooltip>
      ) : null}
    </span>
  )
}
