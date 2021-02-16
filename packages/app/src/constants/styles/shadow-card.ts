import { CSSProperties } from 'react'
import { colors } from './colors'

export const shadowCard: CSSProperties = {
  background: colors.backgroundTertiary,
  boxShadow: '10px 10px ' + colors.backgroundSecondary,
  borderRadius: 8,
  stroke: 'none'
}
