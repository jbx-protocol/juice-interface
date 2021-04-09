import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'
import { colors } from 'constants/styles/colors'

export default function TooltipLabel({
  label,
  tip,
  placement,
}: {
  label: string | JSX.Element
  tip?: string
  placement?: TooltipProps['placement']
}) {
  return (
    <span>
      <span style={{ marginRight: 5 }}>{label}</span>
      {tip ? (
        <Tooltip title={tip} placement={placement}>
          <InfoCircleOutlined style={{ color: colors.grape }} />
        </Tooltip>
      ) : null}
    </span>
  )
}
