import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'

export const VectorsIcon = ({ size }: { size?: number }) => {
  const { forThemeOption } = useContext(ThemeContext)
  return (
    <img
      src={forThemeOption?.({
        dark: '/assets/icons/vectors_od.svg',
        light: '/assets/icons/vectors_ol.svg',
      })}
      alt="Vectors icon"
      width={size || 32}
      height={size || 32}
    />
  )
}
