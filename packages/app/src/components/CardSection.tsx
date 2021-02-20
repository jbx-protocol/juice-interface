import { shadowCard } from '../constants/styles/shadow-card'
import { ChildElems } from '../models/child-elems'

export function CardSection({
  header,
  children,
}: {
  header?: string
  children?: ChildElems
}) {
  return (
    <div>
      {header ? (
        <h2
          style={{
            margin: 0,
            color: 'black',
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
        }}
      >
        {children}
      </div>
    </div>
  )
}
