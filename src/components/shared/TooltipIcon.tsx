import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'
import { CSSProperties } from 'react'

export default function TooltipIcon({
  tip,
  placement,
  iconStyle,
}: {
  tip?: string | JSX.Element
  placement?: TooltipProps['placement']
  iconStyle?: CSSProperties
}) {
  return (
    <Tooltip title={tip} placement={placement} trigger={['hover', 'click']}>
      <QuestionCircleOutlined style={iconStyle} />
    </Tooltip>
  )
}
