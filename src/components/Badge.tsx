import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, PropsWithChildren, useContext } from 'react'

export type BadgeVariant = 'warning' | 'danger' | 'info' | 'tertiary'

const variantStyleLight: { [k in BadgeVariant]: CSSProperties } = {
  warning: {
    color: '#8F4700',
    backgroundColor: '#FBDFAC',
  },
  danger: {
    color: '#8A1500',
    backgroundColor: '#FFD4CC',
  },
  info: {
    color: '#18b4c7',
    backgroundColor: '#32c8db44',
  },
  tertiary: {
    color: '#969696',
    backgroundColor: '#EFECE6',
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
  info: {
    color: '#32c8db',
    border: '1px solid #32c8db',
    backgroundColor: '#32c8db22',
  },
  tertiary: {
    color: '#969696',
    border: '1px solid #969696',
    backgroundColor: '#EFECE6',
  },
}

export function Badge({
  upperCase,
  children,
  variant,
  style,
}: PropsWithChildren<{
  variant: BadgeVariant
  style?: CSSProperties
  upperCase?: boolean
}>) {
  const { isDarkMode } = useContext(ThemeContext)
  const variantStyle = isDarkMode ? variantStyleDark : variantStyleLight

  return (
    <span
      style={{
        padding: '0.1rem 0.5rem',
        fontSize: 12,
        fontWeight: 400,
        borderRadius: 12,
        textTransform: upperCase ? 'uppercase' : undefined,
        ...variantStyle[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
