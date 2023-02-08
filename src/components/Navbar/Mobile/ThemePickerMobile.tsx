import { Trans } from '@lingui/macro'
import Moon from 'components/icons/Moon'
import Sun from 'components/icons/Sun'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { ThemeOption } from 'constants/theme/themeOption'

export default function ThemePickerMobile() {
  const { themeOption, setThemeOption } = useContext(ThemeContext)

  return (
    <div
      className="flex cursor-pointer items-center"
      onClick={() =>
        setThemeOption(
          themeOption === ThemeOption.dark
            ? ThemeOption.light
            : ThemeOption.dark,
        )
      }
    >
      {themeOption === ThemeOption.dark ? (
        <>
          <Sun size={16} />
          <div className="mb-1 ml-2">
            <Trans>Light theme</Trans>
          </div>
        </>
      ) : (
        <>
          <Moon size={16} />
          <div className="mb-1 ml-2">
            <Trans>Dark theme</Trans>
          </div>
        </>
      )}
    </div>
  )
}
