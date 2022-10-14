import { SemanticColors } from 'models/semantic-theme/colors'

import { ThemeOption } from 'constants/theme/theme-option'

export const boxShadow: Record<ThemeOption, SemanticColors['boxShadow']> = {
  [ThemeOption.light]: { primary: 'rgba(0, 0, 0, 0.2)' },
  [ThemeOption.light1]: { primary: 'rgba(0, 0, 0, 0.2)' },
  [ThemeOption.dark]: { primary: '#000000' },
  [ThemeOption.dark1]: { primary: '#000000' },
}
