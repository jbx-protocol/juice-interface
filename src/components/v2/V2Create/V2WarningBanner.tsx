import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function V2WarningBanner() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        background: colors.background.brand.primary,
        padding: '0.5rem',
        textAlign: 'center',
      }}
    >
      <InfoCircleOutlined /> Your project will be created on the Juicebox V2
      contracts.
    </div>
  )
}
