import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'

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
        padding: '1rem 3.3rem',
        backgroundColor: colors.background.l2,
        position: 'relative',
      }}
    >
      <ExclamationCircleOutlined
        style={{ position: 'absolute', left: 20, top: 18 }}
      />

      <h2 style={{ color: colors.text.primary, fontSize: 14, fontWeight: 600 }}>
        {title}
      </h2>
      <p>{body}</p>

      <div>{actions}</div>
    </div>
  )
}
