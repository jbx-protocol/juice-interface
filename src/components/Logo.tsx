import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import Image from 'next/image'
import { useContext } from 'react'
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
  const { themeOption } = useContext(ThemeContext)

  const imgSrc =
    themeOverride === 'dark' || themeOption === ThemeOption.dark
      ? DARK_JUICE_LOGO
      : LIGHT_JUICE_LOGO

  if (!imgSrc) return null

  return (
    <div className={twMerge('relative flex w-36 md:w-36', className)}>
      <Image
        src={imgSrc}
        alt="Juicebox logo"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}
