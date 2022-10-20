import { SemanticColors } from 'models/semantic-theme/colors'

import { darkColors, lightColors } from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const backgroundColors: Record<
  ThemeOption,
  SemanticColors['background']
> = {
  [ThemeOption.light]: {
    l0: '#FEFDFB',
    l1: '#e7e3dc',
    l2: '#f5f4ef',
    l3: '#FBF9F6',
    disabled: '#00000018',
    success: lightColors.green,
    warn: lightColors.juiceLighter,
    failure: lightColors.red,
    brand: {
      primary: lightColors.juiceOrange,
      secondary: lightColors.juiceLight,
    },
    action: {
      primary: lightColors.cta,
      secondary: '#32c8db44',
      highlight: '#3dd1e4',
    },
  },
  [ThemeOption.dark]: {
    l0: darkColors.dark0,
    l1: darkColors.dark1,
    l2: darkColors.dark2,
    l3: darkColors.dark3,
    disabled: darkColors.light0 + '44',
    success: darkColors.green,
    warn: darkColors.juiceDarkest,
    failure: darkColors.red,
    brand: {
      primary: darkColors.juiceOrange,
      secondary: darkColors.juiceLight,
    },
    action: {
      primary: darkColors.cta,
      secondary: darkColors.ctaHint,
      highlight: darkColors.ctaHighlight,
    },
  },
}
