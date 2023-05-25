import { ThemeOption } from 'constants/theme/themeOption'
import { createContext } from 'react'

const defaultThemeOption: ThemeOption = ThemeOption.dark

export type ThemeContextType = {
  themeOption: ThemeOption
  setThemeOption: (themeOption: ThemeOption) => void
  forThemeOption?: <T>(map: Record<ThemeOption, T>) => T
  isMobile: boolean
}

export const ThemeContext = createContext<ThemeContextType>({
  themeOption: defaultThemeOption,
  isMobile: false,
  setThemeOption: function () {
    console.warn('setThemeOption is not implemented')
    return null
  },
})
