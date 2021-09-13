import { ThemeContext } from 'contexts/themeContext'
import { useJuiceTheme } from 'hooks/JuiceTheme'
import { ChildElems } from 'models/child-elems'

export default function Theme({ children }: { children: ChildElems }) {
  const juiceTheme = useJuiceTheme()

  return (
    <ThemeContext.Provider value={juiceTheme}>{children}</ThemeContext.Provider>
  )
}
