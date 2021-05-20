import { juiceColors } from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'
import { SemanticColors } from 'models/semantic-theme/colors'

export const strokeColors: Record<ThemeOption, SemanticColors['stroke']> = {
  [ThemeOption.light]: {
    primary: '#00000048',
    secondary: '#00000032',
    tertiary: '#00000018',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    disabled: juiceColors.light2,
    action: {
      primary: juiceColors.cta,
      secondary: '#32c8db44',
      highlight: '#3dd1e4',
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
