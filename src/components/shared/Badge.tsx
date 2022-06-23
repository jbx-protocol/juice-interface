import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, PropsWithChildren, useContext } from 'react'

export type BadgeVariant = 'success' | 'warning' | 'danger'

export function Badge({
  children,
  variant,
  style,
}: PropsWithChildren<{ variant: BadgeVariant; style?: CSSProperties }>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const variantStyle: { [k in BadgeVariant]: CSSProperties } = {
    success: {
      color: colors.text.success,
      backgroundColor: colors.background.success,
    },
    warning: {
      color: '#8f4700',
      backgroundColor: '#FBD99D',
    },
    danger: {
      color: colors.text.failure,
      backgroundColor: '#fdd4cd',
    },
  }

  return (
    <span
      style={{
        padding: '0.1rem 0.4rem',
        fontSize: 12,
        fontWeight: 400,
        borderRadius: 10,
        ...variantStyle[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
