import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'

export const CommunityIcon = ({ size }: { size?: number }) => {
  const { forThemeOption } = useContext(ThemeContext)
  return (
    <img
      src={forThemeOption?.({
        dark: '/assets/icons/community_od.svg',
        light: '/assets/icons/community_ol.svg',
      })}
      alt="Community icon"
      width={size || 32}
      height={size || 32}
    />
  )
}
