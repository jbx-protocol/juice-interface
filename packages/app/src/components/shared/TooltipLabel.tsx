import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function TooltipLabel({
  label,
  tip,
  placement,
}: {
  label: string | JSX.Element
  tip?: string
  placement?: TooltipProps['placement']
}) {
  const { colors } = useContext(ThemeContext).theme

  return (
    <span>
      <span style={{ marginRight: 5 }}>{label}</span>
      {tip ? (
        <Tooltip title={tip} placement={placement}>
          <InfoCircleOutlined style={{ color: colors.icon.secondary }} />
        </Tooltip>
      ) : null}
    </span>
  )
}
