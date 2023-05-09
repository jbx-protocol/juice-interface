import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'

export default function useMobile() {
  const { isMobile } = useContext(ThemeContext)
  return isMobile
}
