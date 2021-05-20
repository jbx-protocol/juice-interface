import { juiceColors } from 'constants/styles/colors'
import { SemanticColors } from 'models/semantic-theme/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const backgroundColors: Record<
  ThemeOption,
  SemanticColors['background']
> = {
  [ThemeOption.light]: {
    l0: '#fff',
    l1: '#e7e3dc',
    l2: '#f3f1ec',
    disabled: '#00000018',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    brand: {
      primary: juiceColors.juiceOrange,
      secondary: juiceColors.juiceLight,
    },
    action: {
      primary: juiceColors.cta,
      secondary: '#32c8db44',
      highlight: '#3dd1e4',
    },
  },
  [ThemeOption.dark]: {
    l0: juiceColors.dark0,
    l1: juiceColors.dark1,
    l2: juiceColors.dark2,
    disabled: juiceColors.dark2 + 'dd',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    brand: {
      primary: juiceColors.juiceOrange,
      secondary: juiceColors.juiceLight,
    },
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.ctaHint,
      highlight: juiceColors.ctaHighlight,
    },
  },
}
