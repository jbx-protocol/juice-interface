import { shadowCard } from 'constants/styles/shadowCard'
import { ChildElems } from 'models/child-elems'
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
          ...shadowCard,
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
