import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export default function FundingCycleDetailWarning({
  tooltipTitle,
  showWarning,
  children,
}: PropsWithChildren<{
  tooltipTitle?: string
  showWarning?: boolean
}>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!showWarning) return <span>{children}</span>

  return (
    <Tooltip title={tooltipTitle}>
      <span style={{ fontWeight: 500 }}>{children} </span>
      <span style={{ color: colors.text.warn }}>
        <ExclamationCircleOutlined />
      </span>
    </Tooltip>
  )
}
