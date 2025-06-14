import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import Image from "next/legacy/image"
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import LIGHT_JUICE_LOGO from '/public/assets/juice-logo-full_black.svg'
import DARK_JUICE_LOGO from '/public/assets/juice-logo-full_white.svg'
import LIGHT_JUICE_ICON from '/public/assets/juice-logo-icon_black.png'
import DARK_JUICE_ICON from '/public/assets/juice-logo-icon_white.png'

export default function Logo({
  className,
  themeOverride,
  iconOnly = false,
}: {
  className?: string
  themeOverride?: 'dark' | 'light'
  iconOnly?: boolean
}) {
  const { themeOption } = useContext(ThemeContext)

  const isDark = themeOverride === 'dark' || themeOption === ThemeOption.dark
  
  const imgSrc = iconOnly
    ? (isDark ? DARK_JUICE_ICON : LIGHT_JUICE_ICON)
    : (isDark ? DARK_JUICE_LOGO : LIGHT_JUICE_LOGO)

  if (!imgSrc) return null

  return (
    <div className={twMerge('relative flex w-36 md:w-36', iconOnly && 'w-8 md:w-8', className)}>
      <Image
        src={imgSrc}
        alt={iconOnly ? "Juicebox icon" : "Juicebox logo"}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}
