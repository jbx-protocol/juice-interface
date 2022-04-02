import { SemanticTheme } from 'models/semantic-theme/theme'
import { CSSProperties } from 'react'

export const textSecondary = (theme: SemanticTheme): CSSProperties => ({
  textTransform: 'uppercase',
  color: theme.colors.text.tertiary,
  fontSize: '0.8rem',
  fontWeight: 500,
})
