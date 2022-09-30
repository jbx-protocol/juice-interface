import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

type BannerVariant = 'warning' | 'info'

export default function Banner({
  title,
  body,
  actions,
  variant,
}: {
  title: string | JSX.Element
  body: string | JSX.Element
  actions?: JSX.Element
  variant?: BannerVariant
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const variantStyle: { [k in BannerVariant]: CSSProperties } = {
    warning: {
      color: '#8F4700',
      backgroundColor: '#FFF8E5',
      border: '1px solid ' + colors.text.brand.secondary,
    },
    info: {
      backgroundColor: colors.background.l2,
    },
  }

  const style = variantStyle[variant ?? 'info']

  return (
    <div
      style={{
        padding: '1rem 3.3rem',
        position: 'relative',
        ...style,
      }}
    >
      <ExclamationCircleOutlined
        style={{ position: 'absolute', left: 20, top: 18 }}
      />

      <h2
        style={{
          color: style.color ?? colors.text.primary,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {title}
      </h2>
      <p>{body}</p>

      {actions && <div>{actions}</div>}
    </div>
  )
}
