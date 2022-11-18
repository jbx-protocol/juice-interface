import { CSSProperties } from 'react'

export function BigHeading({
  text,
  style,
}: {
  text: string | JSX.Element
  style?: CSSProperties
}) {
  return (
    <h1
      style={{
        fontSize: '2.4rem',
        fontWeight: 600,
        lineHeight: 1.2,
        margin: 0,
        ...style,
      }}
    >
      {text}
    </h1>
  )
}
