import { SemanticTheme } from 'models/semantic-theme/theme'

import { ThemeOption } from 'constants/theme/theme-option'

import { juiceThemeColors } from './colors'
import { juiceRadii } from './radius'

export const juiceTheme = (themeOption: ThemeOption): SemanticTheme => ({
  colors: juiceThemeColors(themeOption),
  radii: juiceRadii,
})
