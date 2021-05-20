import { shadowCard } from 'constants/styles/shadowCard'
import { ThemeContext } from 'contexts/themeContext'
import { ChildElems } from 'models/child-elems'
import { useContext } from 'react'
import { CSSProperties } from 'react'

export function CardSection({
  header,
  padded,
  children,
  style,
}: {
  header?: string
  padded?: boolean
  children?: ChildElems
  style?: CSSProperties
}) {
  const { theme, themeOption } = useContext(ThemeContext)
  return (
    <div>
      {header ? (
        <h2
          style={{
            margin: 0,
            fontWeight: 600,
          }}
        >
          {header}
        </h2>
      ) : null}
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
