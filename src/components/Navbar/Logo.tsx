import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { ThemeOption } from 'constants/theme/theme-option'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'

export default function Logo({ className }: { className?: string }) {
  const { forThemeOption } = useContext(ThemeContext)

  if (!forThemeOption) return null

  return (
    <div className={twMerge('relative h-9 w-7 md:h-10 md:w-8', className)}>
      <Image
        layout="fill"
        objectFit="contain"
        src={forThemeOption({
          [ThemeOption.light]: '/assets/juice_logo-ol.png',
          [ThemeOption.dark]: '/assets/juice_logo-od.png',
        })}
        alt="Juicebox logo"
      />
    </div>
  )
}
