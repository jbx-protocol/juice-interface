import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'
import { twMerge } from 'tailwind-merge'

export default function Logo({ className }: { className?: string }) {
  const { forThemeOption } = useContext(ThemeContext)

  return (
    <img
      className={twMerge('h-10', className)}
      src={forThemeOption?.({
        [ThemeOption.light]: '/assets/juice_logo-ol.png',
        [ThemeOption.dark]: '/assets/juice_logo-od.png',
      })}
      alt="Juicebox logo"
    />
  )
}
