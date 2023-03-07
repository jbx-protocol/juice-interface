import { SemanticColors } from 'models/semantic-theme/colors'

import { darkColors } from 'constants/theme/colors/colors'
import { ThemeOption } from 'constants/theme/themeOption'

export const strokeColors: Record<ThemeOption, SemanticColors['stroke']> = {
  [ThemeOption.light]: {
    primary: '#00000048',
    secondary: '#00000032',
    tertiary: '#00000018',
  },
  [ThemeOption.dark]: {
    primary: darkColors.light1,
    secondary: darkColors.light2,
    tertiary: darkColors.light3,
  },
}
