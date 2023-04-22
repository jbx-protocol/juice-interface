import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type AnimationState = {
  moon?: string
  sun?: string
}

export default function ThemePicker({ className }: { className?: string }) {
  const { themeOption, setThemeOption } = useContext(ThemeContext)
  const [animation, setAnimation] = useState<AnimationState>({
    moon: themeOption === ThemeOption.light ? 'animate-rise' : 'animate-set',
    sun: themeOption === ThemeOption.dark ? 'animate-rise' : 'animate-set',
  })
  const [hasClicked, setHasClicked] = useState(false)

  const onThemeChange = () => {
    setHasClicked(true)
    setThemeOption(
      themeOption === ThemeOption.dark ? ThemeOption.light : ThemeOption.dark,
    )
    setAnimation({
      moon: themeOption === ThemeOption.dark ? 'animate-rise' : 'animate-set',
      sun: themeOption === ThemeOption.light ? 'animate-rise' : 'animate-set',
    })
  }

  return (
    <div
      className={twMerge(
        'cursor-pointer hover:text-bluebs-500 hover:dark:text-bluebs-300',
        className,
      )}
      onClick={onThemeChange}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-6 w-6">
          <MoonIcon
            className={twMerge(
              'absolute top-0 left-0 h-6 w-6',
              hasClicked
                ? animation.moon
                : themeOption === ThemeOption.dark
                ? 'hidden'
                : '',
            )}
          />
          <SunIcon
            className={twMerge(
              'absolute top-0 left-0 h-6 w-6',
              hasClicked
                ? animation.sun
                : themeOption === ThemeOption.light
                ? 'hidden'
                : '',
            )}
          />
        </div>
        <span className="font-medium md:hidden">
          {themeOption === ThemeOption.dark ? 'Dark' : 'Light'} Theme
        </span>
      </div>
    </div>
  )
}
