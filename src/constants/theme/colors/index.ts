import { ThemeOption } from 'constants/theme/themeOption'
import { SemanticColors } from 'models/semantic-theme/colors'
import { backgroundColors } from './background'
import { strokeColors } from './stroke'
import { textColors } from './text'

export const juiceThemeColors = (themeOption: ThemeOption): SemanticColors => ({
  background: backgroundColors[themeOption],
  text: textColors[themeOption],
  stroke: strokeColors[themeOption],
})
