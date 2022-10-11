import { CSSProperties } from 'react'

export const emphasisedTextStyle = (fontSize?: string): CSSProperties => ({
  fontWeight: 500,
  fontSize: fontSize ?? '1rem',
})

export const headerTextStyle: CSSProperties = {
  fontWeight: 400,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
}

export const flexColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}
