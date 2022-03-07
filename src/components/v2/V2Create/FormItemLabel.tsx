import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'

export default function FormItemLabel({ children }: PropsWithChildren<{}>) {
  const { colors } = useContext(ThemeContext).theme

  return (
    <h3 style={{ color: colors.text.primary, marginRight: '1rem' }}>
      {children}
    </h3>
  )
}
