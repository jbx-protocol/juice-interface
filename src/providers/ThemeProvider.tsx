import { ThemeContext } from 'contexts/themeContext'
import { useJuiceTheme } from 'hooks/JuiceTheme'

export const ThemeProvider: React.FC = ({ children }) => {
  const juiceTheme = useJuiceTheme()
  const isDarkMode = juiceTheme.isDarkMode

  return (
    <ThemeContext.Provider value={juiceTheme}>
      {/* Set the dark mode flag if dark mode is enabled */}
      <div className={isDarkMode ? 'dark' : undefined}>{children}</div>
    </ThemeContext.Provider>
  )
}
