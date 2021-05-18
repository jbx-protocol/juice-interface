import { juiceTheme } from 'constants/theme'
import { SemanticTheme } from 'models/semantic-theme/theme'
import { ThemeOption } from 'constants/theme/theme-option'
import { createContext } from 'react'

export const ThemeContext = createContext<{
  theme: SemanticTheme
  setThemeOption: (themeOption: ThemeOption) => void
}>({
  theme: juiceTheme(ThemeOption.dark),
  setThemeOption: (themeOption: ThemeOption) => null,
})
