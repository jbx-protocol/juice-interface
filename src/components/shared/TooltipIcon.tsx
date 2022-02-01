import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'
import { CSSProperties } from 'react'

export default function TooltipIcon({
  tip,
  placement,
  style,
}: {
  tip?: string | JSX.Element
  placement?: TooltipProps['placement']
  style?: CSSProperties
}) {
  return (
    <Tooltip
      title={tip}
      placement={placement}
      trigger={['hover', 'click']}
      style={style}
    >
      <QuestionCircleOutlined />
    </Tooltip>
  )
}
