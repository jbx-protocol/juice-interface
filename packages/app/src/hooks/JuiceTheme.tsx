import { juiceTheme } from 'constants/theme'
import { ThemeOption } from 'constants/theme/theme-option'
import { useEffect, useState } from 'react'

const flattenNestedObject = (
  nestedObj: Record<string, any>,
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

export function useJuiceTheme(initialThemeOption: ThemeOption) {
  const [currentThemeOption, setCurrentThemeOption] = useState<ThemeOption>()

  const setRootVarsForThemeOption = (themeOption: ThemeOption) => {
    Object.entries(
      flattenNestedObject(juiceTheme(themeOption).colors),
    ).forEach(([key, value]) =>
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

  useEffect(() => setRootVarsForThemeOption(initialThemeOption), [
    initialThemeOption,
  ])

  return {
    theme: juiceTheme(initialThemeOption || currentThemeOption),
    setThemeOption: (themeOption: ThemeOption) => {
      setRootVarsForThemeOption(themeOption)
      setCurrentThemeOption(themeOption)
    },
  }
}
