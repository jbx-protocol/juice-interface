import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, PropsWithChildren, useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function Callout({
  style,
  transparent,
  children,
  iconComponent,
}: PropsWithChildren<{
  style?: CSSProperties
  transparent?: boolean
  iconComponent?: JSX.Element
}>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        color: colors.text.primary,
        padding: '1rem',
        backgroundColor: transparent ? undefined : colors.background.l2,
        display: 'flex',
        alignItems: 'flex-start',
        ...style,
      }}
    >
      <span style={{ marginRight: '1rem', lineHeight: 1.8 }}>
        {iconComponent ?? <InfoCircleOutlined />}
      </span>
      <div style={{ width: '100%' }}>{children}</div>
    </div>
  )
}
