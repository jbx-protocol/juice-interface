import { SemanticColors } from 'models/semantic-theme/colors'
import { CSSProperties } from 'react'

export const smallHeaderStyle: (colors: SemanticColors) => CSSProperties = (
  colors: SemanticColors,
) => ({
  fontSize: '.7rem',
  fontWeight: 500,
  cursor: 'default',
  color: colors.text.tertiary,
})