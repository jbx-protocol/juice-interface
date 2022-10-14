/* eslint-disable @typescript-eslint/no-unused-vars */
import { SemanticTheme } from 'models/semantic-theme/theme'

import { createContext } from 'react'

import { juiceTheme } from 'constants/theme'
import { darkThemes, ThemeOption } from 'constants/theme/theme-option'

const defaultThemeOption: ThemeOption = ThemeOption.dark

export type ThemeContextType = {
  themeOption: ThemeOption
  theme: SemanticTheme
  isDarkMode: boolean
  setThemeOption: (themeOption: ThemeOption) => void
  forThemeOption?: <T>(map: Record<ThemeOption, T>) => T
}

export const ThemeContext = createContext<ThemeContextType>({
  themeOption: defaultThemeOption,
  theme: juiceTheme(defaultThemeOption),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setThemeOption: function (themeOption: ThemeOption) {},
  isDarkMode: darkThemes.has(defaultThemeOption),
})
