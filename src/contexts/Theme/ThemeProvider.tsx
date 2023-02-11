import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useJuiceTheme } from 'contexts/Theme/JuiceTheme'

export const ThemeProvider: React.FC = ({ children }) => {
  const juiceTheme = useJuiceTheme()

  return (
    <ThemeContext.Provider value={juiceTheme}>
      {/* Set the dark mode flag if dark mode is enabled */}
      <div>{children}</div>
    </ThemeContext.Provider>
  )
}
