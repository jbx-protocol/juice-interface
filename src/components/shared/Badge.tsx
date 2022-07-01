import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, PropsWithChildren, useContext } from 'react'

export type BadgeVariant = 'warning' | 'danger'

const variantStyleLight: { [k in BadgeVariant]: CSSProperties } = {
  warning: {
    color: '#8F4700',
    backgroundColor: '#FBDFAC',
  },
  danger: {
    color: '#8A1500',
    backgroundColor: '#FFD4CC',
  },
}

const variantStyleDark: { [k in BadgeVariant]: CSSProperties } = {
  warning: {
    color: '#FBD99D',
    border: '1px solid #D1BB94',
    backgroundColor: '#5C513D',
  },
  danger: {
    color: '#FFBBAD',
    border: '1px solid #FFBBAD',
    backgroundColor: '#592E26',
  },
}

export function Badge({
  children,
  variant,
  style,
}: PropsWithChildren<{ variant: BadgeVariant; style?: CSSProperties }>) {
  const { isDarkMode } = useContext(ThemeContext)

  const variantStyle = isDarkMode ? variantStyleDark : variantStyleLight

  return (
    <span
      style={{
        padding: '0.1rem 0.5rem',
        fontSize: 12,
        fontWeight: 400,
        borderRadius: 12,
        ...variantStyle[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
