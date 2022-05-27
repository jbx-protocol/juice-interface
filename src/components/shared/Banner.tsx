import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function Banner({
  title,
  body,
  actions,
  variant = 'info',
}: {
  title: string | JSX.Element
  body: string | JSX.Element
  actions: JSX.Element
  variant?: 'info'
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        padding: '1rem 2rem',
        backgroundColor: colors.background.action.secondary,
      }}
    >
      <h3 style={{ color: colors.text.primary }}>{title}</h3>
      <p>{body}</p>

      <div>{actions}</div>
    </div>
  )
}
