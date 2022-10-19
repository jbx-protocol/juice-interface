import { juiceTheme } from 'constants/theme'
import { ThemeOption } from 'constants/theme/theme-option'
import type { ThemeContextType } from 'contexts/themeContext'
import { useEffect, useState } from 'react'

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

const userPrefersDarkMode = (): boolean => {
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
}

const getInitialThemeOption = (storageKey: string) => {
  const storedThemeOption = localStorage.getItem(storageKey)
  if (storedThemeOption) {
    return storedThemeOption as ThemeOption
  }

  return userPrefersDarkMode() ? ThemeOption.dark : ThemeOption.light
}

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

export function useJuiceTheme(storageKey = 'jb_theme'): ThemeContextType {
  const initialThemeOption = getInitialThemeOption(storageKey)
  const [currentThemeOption, setCurrentThemeOption] =
    useState<ThemeOption>(initialThemeOption)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    initialThemeOption === ThemeOption.dark,
  )

  useEffect(
    () => setRootVarsForThemeOption(initialThemeOption),
    [initialThemeOption],
  )

  useEffect(() => {
    setIsDarkMode(currentThemeOption === ThemeOption.dark)
    document.documentElement.style.setProperty(
      'color-scheme',
      currentThemeOption,
    )
  }, [currentThemeOption])

  return {
    themeOption: currentThemeOption,
    theme: juiceTheme(currentThemeOption),
    isDarkMode,
    forThemeOption: map => map[currentThemeOption],
    setThemeOption: (themeOption: ThemeOption) => {
      setRootVarsForThemeOption(themeOption)
      setCurrentThemeOption(themeOption)
      localStorage?.setItem(storageKey, themeOption)
    },
  }
}
