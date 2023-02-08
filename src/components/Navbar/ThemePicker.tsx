import Moon from 'components/icons/Moon'
import Sun from 'components/icons/Sun'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { ThemeOption } from 'constants/theme/themeOption'
import { classNames } from 'utils/classNames'

export default function ThemePicker() {
  const { themeOption, setThemeOption } = useContext(ThemeContext)

  const iconSize = 18

  return (
    <div
      className="flex h-8 w-16 min-w-[64px] cursor-pointer items-center justify-evenly rounded-full border border-solid border-smoke-300 transition-colors hover:border-smoke-500 dark:border-slate-300 dark:hover:border-slate-100"
      role="switch"
      aria-checked={themeOption === ThemeOption.dark}
      onClick={() =>
        setThemeOption(
          themeOption === ThemeOption.dark
            ? ThemeOption.light
            : ThemeOption.dark,
        )
      }
    >
      <div
        className={classNames(
          'flex items-center justify-center py-2',
          themeOption === ThemeOption.light
            ? 'text-black dark:text-slate-100'
            : 'text-grey-400 dark:text-slate-200',
        )}
      >
        <Sun size={iconSize} />
      </div>
      <div
        className={classNames(
          'flex items-center justify-center py-2',
          themeOption === ThemeOption.dark
            ? 'text-black dark:text-slate-100'
            : 'text-grey-400 dark:text-slate-200',
        )}
      >
        <Moon size={iconSize} />
      </div>
    </div>
  )
}
