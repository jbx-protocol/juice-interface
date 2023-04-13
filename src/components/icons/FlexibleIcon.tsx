import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'

export const FlexibleIcon = ({ size }: { size?: number }) => {
  const { forThemeOption } = useContext(ThemeContext)
  return (
    <img
      src={forThemeOption?.({
        dark: '/assets/icons/flexible_od.svg',
        light: '/assets/icons/flexible_ol.svg',
      })}
      alt="Flexible icon"
      width={size || 32}
      height={size || 32}
    />
  )
}
