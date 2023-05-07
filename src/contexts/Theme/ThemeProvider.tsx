import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useJuiceTheme } from 'contexts/Theme/useJuiceTheme'

export const ThemeProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const juiceTheme = useJuiceTheme()

  return (
    <ThemeContext.Provider value={juiceTheme}>{children}</ThemeContext.Provider>
  )
}
