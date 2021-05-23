import { SemanticTheme } from 'models/semantic-theme/theme'
import { CSSProperties } from 'react'

export const shadowCard = (theme: SemanticTheme): CSSProperties => ({
  background: theme.colors.background.l2,
  boxShadow: '10px 10px ' + theme.colors.background.l1,
  borderRadius: theme.radii.lg,
  stroke: 'none',
})
