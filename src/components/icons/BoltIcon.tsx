import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'

export const BoltIcon = ({ size }: { size?: number }) => {
  const { forThemeOption } = useContext(ThemeContext)
  return (
    <img
      src={forThemeOption?.({
        dark: '/assets/icons/bolt2_od.svg',
        light: '/assets/icons/bolt2_ol.svg',
      })}
      alt="Bolt icon"
      width={size || 32}
      height={size || 32}
    />
  )
}
