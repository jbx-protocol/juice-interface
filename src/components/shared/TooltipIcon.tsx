import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'

export default function TooltipIcon({
  tip,
  placement,
}: {
  tip?: string | JSX.Element
  placement?: TooltipProps['placement']
}) {
  return (
    <Tooltip title={tip} placement={placement}>
      <InfoCircleOutlined />
    </Tooltip>
  )
}
