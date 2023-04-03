import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'

export const Etherscan = ({ size }: { size?: number }) => {
  const { forThemeOption } = useContext(ThemeContext)
  return (
    <img
      src={forThemeOption?.({
        dark: '/assets/icons/etherscan_od.svg',
        light: '/assets/icons/etherscan_ol.svg',
      })}
      alt="Etherscan logo"
      width={size || 15}
      height={size || 15}
    />
  )
}
