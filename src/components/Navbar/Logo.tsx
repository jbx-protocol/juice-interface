import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import Image from 'next/image'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'

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
