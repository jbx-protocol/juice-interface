import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, PropsWithChildren, useContext } from 'react'

import { shadowCard } from 'constants/styles/shadowCard'

export function CardSection({
  header,
  padded = true,
  noShadow,
  children,
  style,
}: PropsWithChildren<{
  header?: string
  padded?: boolean
  noShadow?: boolean
  style?: CSSProperties
}>) {
  const { theme } = useContext(ThemeContext)
  return (
    <div
      style={{
        marginBottom: noShadow ? 0 : 10,
      }}
    >
      {header && (
        <h2
          style={{
            margin: 0,
            fontWeight: 600,
          }}
        >
          {header}
        </h2>
      )}
      <div
        style={{
          ...shadowCard(theme),
          overflow: 'hidden',
          ...style,
          ...(padded ? { padding: 20 } : {}),
        }}
      >
        {children}
      </div>
    </div>
  )
}
