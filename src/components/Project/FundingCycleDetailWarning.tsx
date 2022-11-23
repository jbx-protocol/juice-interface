import { ExclamationCircleOutlined } from '@ant-design/icons'
import { JuiceTooltip } from 'components/JuiceTooltip'
import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'

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
    <div style={{ display: 'flex' }}>
      <span style={{ fontWeight: 500 }}>{children} </span>
      <span style={{ color: colors.text.warn, marginLeft: '0.5rem' }}>
        <JuiceTooltip title={tooltipTitle} placement="top">
          <ExclamationCircleOutlined />
        </JuiceTooltip>
      </span>
    </div>
  )
}
