import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'

export const TrustIcon = ({ size }: { size?: number }) => {
  const { forThemeOption } = useContext(ThemeContext)
  return (
    <img
      src={forThemeOption?.({
        dark: '/assets/icons/trust_od.svg',
        light: '/assets/icons/trust_ol.svg',
      })}
      alt="Trust icon"
      width={size || 32}
      height={size || 32}
    />
  )
}
