import { juiceColors } from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'
import { SemanticColors } from 'models/semantic-theme/colors'

export const strokeColors: Record<ThemeOption, SemanticColors['stroke']> = {
  [ThemeOption.light]: {
    primary: juiceColors.light0,
    secondary: juiceColors.light1,
    tertiary: juiceColors.light2,
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    disabled: juiceColors.light2,
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.ctaHint,
      highlight: juiceColors.ctaHighlight,
    },
  },
  [ThemeOption.dark]: {
    primary: juiceColors.light1,
    secondary: juiceColors.light2,
    tertiary: juiceColors.grapeHint,
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    disabled: juiceColors.light2,
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.light3,
      highlight: juiceColors.ctaHighlight,
    },
  },
}
