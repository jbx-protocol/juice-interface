import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function V2WarningBanner() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        background: colors.stroke.failure,
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      WARNING: your project will be created on the Juicebox V2 contracts.
    </div>
  )
}
