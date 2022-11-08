import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, ReactNode, useContext } from 'react'

export default function TooltipIcon({
  tip,
  placement,
  iconStyle,
  tooltipInnerStyle,
}: {
  tip?: string | JSX.Element | ReactNode
  placement?: TooltipProps['placement']
  iconStyle?: CSSProperties
  tooltipInnerStyle?: CSSProperties
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Tooltip
      title={tip}
      placement={placement}
      trigger={['hover', 'click']}
      overlayInnerStyle={tooltipInnerStyle}
    >
      <QuestionCircleOutlined
        style={{ color: colors.text.primary, ...iconStyle }}
      />
    </Tooltip>
  )
}
