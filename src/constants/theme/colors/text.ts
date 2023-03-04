import { SemanticColors } from 'models/semantic-theme/colors'

import { darkColors, lightColors } from 'constants/theme/colors/colors'
import { ThemeOption } from 'constants/theme/themeOption'

export const textColors: Record<ThemeOption, SemanticColors['text']> = {
  [ThemeOption.light]: {
    primary: lightColors.dark0,
    tertiary: lightColors.dark2,
    brand: {
      primary: lightColors.juiceOrange,
    },
  },
  [ThemeOption.dark]: {
    primary: darkColors.light0,
    tertiary: darkColors.light2,
    brand: {
      primary: darkColors.juiceOrange,
    },
  },
}
