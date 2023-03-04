import { ThemeOption } from 'constants/theme/themeOption'
import { SemanticTheme } from 'models/semantic-theme/theme'
import { juiceThemeColors } from './colors'

export const juiceTheme = (themeOption: ThemeOption): SemanticTheme => ({
  colors: juiceThemeColors(themeOption),
})
