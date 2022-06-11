import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, PropsWithChildren, useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function TabDescription({
  style,
  children,
}: PropsWithChildren<{ style?: CSSProperties }>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        color: colors.text.primary,
        padding: '1rem',
        backgroundColor: colors.background.l2,
        display: 'flex',
        alignItems: 'flex-start',
        ...style,
      }}
    >
      <InfoCircleOutlined style={{ marginRight: '1rem', lineHeight: 1.8 }} />
      <div style={{ width: '100%' }}>{children}</div>
    </div>
  )
}
