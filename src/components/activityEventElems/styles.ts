import { SemanticColors } from 'models/semantic-theme/colors'
import { CSSProperties } from 'react'

export const smallHeaderStyle = (colors: SemanticColors) => ({
  fontSize: '0.75rem',
  color: colors.text.tertiary,
})

export const contentLineHeight: CSSProperties['lineHeight'] = '1.4rem'

export const primaryContentFontSize: CSSProperties['fontSize'] = '1rem'
