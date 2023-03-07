import { SemanticColors } from 'models/semantic-theme/colors'

import { darkColors, lightColors } from 'constants/theme/colors/colors'
import { ThemeOption } from 'constants/theme/themeOption'

export const backgroundColors: Record<
  ThemeOption,
  SemanticColors['background']
> = {
  [ThemeOption.light]: {
    action: {
      primary: lightColors.cta,
    },
  },
  [ThemeOption.dark]: {
    action: {
      primary: darkColors.cta,
    },
  },
}
