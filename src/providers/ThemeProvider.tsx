import { ThemeContext } from 'contexts/themeContext'
import { useJuiceTheme } from 'hooks/JuiceTheme'
import { useLayoutEffect } from 'react'

export const ThemeProvider: React.FC = ({ children }) => {
  const juiceTheme = useJuiceTheme()
  const isDarkMode = juiceTheme.isDarkMode

  // Set the theme on the body element
  // This is needed for tailwind css dark theme classes to work
  useLayoutEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <ThemeContext.Provider value={juiceTheme}>
      {/* Set the dark mode flag if dark mode is enabled */}
      <div>{children}</div>
    </ThemeContext.Provider>
  )
}
