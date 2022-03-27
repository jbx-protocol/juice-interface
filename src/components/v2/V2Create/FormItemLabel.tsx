import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, PropsWithChildren, useContext } from 'react'

export default function FormItemLabel({
  children,
  style,
}: PropsWithChildren<{ style?: CSSProperties }>) {
  const { colors } = useContext(ThemeContext).theme

  return (
    <h3 style={{ ...style, color: colors.text.primary, marginRight: '1rem' }}>
      {children}
    </h3>
  )
}
