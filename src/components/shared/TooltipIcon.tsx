import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function TooltipIcon({
  tip,
  placement,
}: {
  tip?: string | JSX.Element
  placement?: TooltipProps['placement']
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Tooltip title={tip} placement={placement}>
      <InfoCircleOutlined />
    </Tooltip>
  )
}
