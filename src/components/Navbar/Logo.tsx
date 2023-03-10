import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import Image from 'next/image'
import { useContext, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

const DARK_JUICE_LOGO = '/assets/juice_logo-od.png'
const LIGHT_JUICE_LOGO = '/assets/juice_logo-ol.png'

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
    <div className={twMerge('relative h-9 w-7 md:h-10 md:w-8', className)}>
      <Image
        layout="fill"
        objectFit="contain"
        src={imgSrc}
        alt="Juicebox logo"
        priority
      />
    </div>
  )
}
