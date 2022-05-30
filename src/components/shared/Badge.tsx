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
    },
    warning: {
      color: colors.text.warn,
    },
    danger: {
      color: colors.text.failure,
    },
  }

  return (
    <span
      style={{
        padding: '0.1rem 0.4rem',
        fontSize: '0.8rem',
        fontWeight: 400,
        ...variantStyle[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
