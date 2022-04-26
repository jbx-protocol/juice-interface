import { ThemeContext } from 'contexts/themeContext'
import { useJuiceTheme } from 'hooks/JuiceTheme'
import { PropsWithChildren } from 'react'

export const ThemeProvider: React.FC = ({
  children,
}: PropsWithChildren<{}>) => {
  const juiceTheme = useJuiceTheme()

  return (
    <ThemeContext.Provider value={juiceTheme}>{children}</ThemeContext.Provider>
  )
}
