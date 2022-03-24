import { ThemeContext } from 'contexts/themeContext'
import { ChildElems } from 'models/child-elems'
import { CSSProperties, useContext } from 'react'

export default function FormItemLabel({
  children,
  style,
}: {
  children: ChildElems | string
  style?: CSSProperties
}) {
  const { colors } = useContext(ThemeContext).theme

  return (
    <h3 style={{ ...style, color: colors.text.primary, marginRight: '1rem' }}>
      {children}
    </h3>
  )
}
