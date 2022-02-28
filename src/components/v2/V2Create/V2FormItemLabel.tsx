import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function V2FormItemLabel({ label }: { label?: string }) {
  const { colors } = useContext(ThemeContext).theme

  return (
    <h3 style={{ color: colors.text.primary, marginRight: '1rem' }}>{label}</h3>
  )
}
