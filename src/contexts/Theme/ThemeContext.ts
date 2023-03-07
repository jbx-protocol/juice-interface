import { juiceTheme } from 'constants/theme'
import { ThemeOption } from 'constants/theme/themeOption'
import { SemanticTheme } from 'models/semantic-theme/theme'
import { createContext } from 'react'

const defaultThemeOption: ThemeOption = ThemeOption.dark

export type ThemeContextType = {
  themeOption: ThemeOption
  theme: SemanticTheme
  setThemeOption: (themeOption: ThemeOption) => void
  forThemeOption?: <T>(map: Record<ThemeOption, T>) => T
}

export const ThemeContext = createContext<ThemeContextType>({
  themeOption: defaultThemeOption,
  theme: juiceTheme(defaultThemeOption),
  setThemeOption: function () {
    console.warn('setThemeOption is not implemented')
    return null
  },
})
