import { ThemeOption } from 'constants/theme/themeOption'
import type { ThemeContextType } from 'contexts/Theme/ThemeContext'
import { startTransition, useEffect, useState } from 'react'
import { useMedia } from './useMedia'

export const THEME_STORAGE_KEY = 'jb_theme'

const userPrefersDarkMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
}

export const getInitialThemeOption = () => {
  if (typeof window === 'undefined') {
    return
  }

  const storedThemeOption = localStorage?.getItem(THEME_STORAGE_KEY)
  if (storedThemeOption) {
    return storedThemeOption as ThemeOption
  }

  return userPrefersDarkMode() ? ThemeOption.dark : ThemeOption.light
}

export const syncTheme = (themeOption: ThemeOption | undefined) => {
  if (!themeOption || typeof document === 'undefined') {
    return
  }

  if (themeOption === ThemeOption.dark) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }

  document.documentElement.style.setProperty('color-scheme', themeOption)

  localStorage?.setItem(THEME_STORAGE_KEY, themeOption)
}

export function useJuiceTheme(): ThemeContextType {
  const [currentThemeOption, setCurrentThemeOption] = useState<ThemeOption>(
    'light' as ThemeOption,
  )

  const isMobile = useMedia('(max-width: 767px)')

  // Load the theme from local storage on initial load
  useEffect(() => {
    const initialThemeOption = getInitialThemeOption()
    if (!initialThemeOption) {
      return
    }

    setCurrentThemeOption(initialThemeOption)
  }, [])

  function setThemeOption(themeOption: ThemeOption) {
    syncTheme(themeOption)
    setCurrentThemeOption(themeOption)
  }

  return {
    themeOption: currentThemeOption,
    forThemeOption: map => map[currentThemeOption],
    setThemeOption,
    isMobile,
  }
}
