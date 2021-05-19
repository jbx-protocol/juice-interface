import { juiceTheme } from 'constants/theme'
import { ThemeOption } from 'constants/theme/theme-option'
import { SemanticTheme } from 'models/semantic-theme/theme'
import { createContext } from 'react'

const defaultThemeOption: ThemeOption = ThemeOption.dark

export type ThemeContext = {
  themeOption: ThemeOption
  theme: SemanticTheme
  setThemeOption: (themeOption: ThemeOption) => void
}

export const ThemeContext = createContext<ThemeContext>({
  themeOption: defaultThemeOption,
  theme: juiceTheme(defaultThemeOption),
  setThemeOption: (themeOption: ThemeOption) => {},
})
