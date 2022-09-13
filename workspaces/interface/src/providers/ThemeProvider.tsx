import { ThemeContext } from 'contexts/themeContext'
import { useJuiceTheme } from 'hooks/JuiceTheme'

export const ThemeProvider: React.FC = ({ children }) => {
  const juiceTheme = useJuiceTheme()

  return (
    <ThemeContext.Provider value={juiceTheme}>{children}</ThemeContext.Provider>
  )
}
