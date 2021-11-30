import { SemanticColors } from 'models/semantic-theme/colors'

import { ThemeOption } from 'constants/theme/theme-option'

import { backgroundColors } from './background'
import { iconColors } from './icon'
import { strokeColors } from './stroke'
import { textColors } from './text'

export const juiceThemeColors = (themeOption: ThemeOption): SemanticColors => ({
  background: backgroundColors[themeOption],
  text: textColors[themeOption],
  icon: iconColors[themeOption],
  stroke: strokeColors[themeOption],
})
