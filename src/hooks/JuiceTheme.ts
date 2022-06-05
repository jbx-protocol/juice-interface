import type { ThemeContextType } from 'contexts/themeContext'

import { useEffect, useState } from 'react'

import { juiceTheme } from 'constants/theme'
import { ThemeOption } from 'constants/theme/theme-option'

const flattenNestedObject = (
  nestedObj: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  prefix?: string,
): Record<string, string> =>
  Object.keys(nestedObj).reduce((acc, key) => {
    const name = prefix ? prefix + '-' + key : key
    return {
      ...acc,
      ...(typeof nestedObj[key] === 'string'
        ? { [name]: nestedObj[key] }
        : flattenNestedObject(nestedObj[key], name)),
    }
  }, {})

export function useJuiceTheme(storageKey = 'jb_theme'): ThemeContextType {
  const initialThemeOption =
    (localStorage.getItem(storageKey) as ThemeOption) || ThemeOption.light

  const [currentThemeOption, setCurrentThemeOption] =
    useState<ThemeOption>(initialThemeOption)

  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    initialThemeOption === ThemeOption.dark,
  )

  const setRootVarsForThemeOption = (themeOption: ThemeOption) => {
    Object.entries(flattenNestedObject(juiceTheme(themeOption).colors)).forEach(
      ([key, value]) =>
        document.documentElement.style.setProperty('--' + key, value),
    )

    Object.entries(juiceTheme(themeOption).radii).forEach(([key, value]) => {
      if (!value) return
      document.documentElement.style.setProperty(
        '--radius-' + key,
        value.toString(),
      )
    })
  }

  useEffect(
    () => setRootVarsForThemeOption(initialThemeOption),
    [initialThemeOption],
  )

  useEffect(
    () => setIsDarkMode(currentThemeOption === ThemeOption.dark),
    [currentThemeOption],
  )

  return {
    themeOption: currentThemeOption,
    theme: juiceTheme(currentThemeOption),
    isDarkMode: isDarkMode,
    forThemeOption: map => map[currentThemeOption],
    setThemeOption: (themeOption: ThemeOption) => {
      setRootVarsForThemeOption(themeOption)
      setCurrentThemeOption(themeOption)
      localStorage.setItem(storageKey, themeOption)
    },
  }
}
