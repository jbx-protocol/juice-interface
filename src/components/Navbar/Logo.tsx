import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import Image from 'next/image'
import { useContext, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import LIGHT_JUICE_LOGO from '/public/assets/juice-logo-full_black.svg'
import DARK_JUICE_LOGO from '/public/assets/juice-logo-full_white.svg'

export default function Logo({
  className,
  themeOverride,
}: {
  className?: string
  themeOverride?: 'dark' | 'light'
}) {
  const { forThemeOption } = useContext(ThemeContext)

  const imgSrc = useMemo(() => {
    if (themeOverride) {
      return themeOverride === 'dark' ? DARK_JUICE_LOGO : LIGHT_JUICE_LOGO
    }
    if (forThemeOption) {
      return forThemeOption({
        [ThemeOption.light]: LIGHT_JUICE_LOGO,
        [ThemeOption.dark]: DARK_JUICE_LOGO,
      })
    }
    return undefined
  }, [forThemeOption, themeOverride])

  if (!imgSrc) return null

  return (
    <div className={twMerge('relative flex w-36 md:w-36', className)}>
      <Image src={imgSrc} alt="Juicebox logo" />
    </div>
  )
}
