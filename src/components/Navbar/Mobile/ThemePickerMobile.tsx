import Moon from 'components/icons/Moon'
import Sun from 'components/icons/Sun'
import { Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

export default function ThemePickerMobile() {
  const { themeOption, setThemeOption } = useContext(ThemeContext)

  return (
    <div
      style={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
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
          <div style={{ margin: '0 0 2px 10px' }}>
            <Trans>Light theme</Trans>
          </div>
        </>
      ) : (
        <>
          <Moon size={16} />
          <div style={{ margin: '0 0 2px 10px' }}>
            <Trans>Dark theme</Trans>
          </div>
        </>
      )}
    </div>
  )
}
