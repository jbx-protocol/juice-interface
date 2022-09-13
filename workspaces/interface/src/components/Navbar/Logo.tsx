import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

export default function Logo({ height }: { height?: number }) {
  const { forThemeOption } = useContext(ThemeContext)

  if (!height) {
    height = 40
  }

  return (
    <img
      style={{ height }}
      src={
        forThemeOption &&
        forThemeOption({
          [ThemeOption.light]: '/assets/juice_logo-ol.png',
          [ThemeOption.dark]: '/assets/juice_logo-od.png',
        })
      }
      alt="Juicebox logo"
    />
  )
}
