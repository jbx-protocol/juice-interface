import Moon from 'components/icons/Moon'
import Sun from 'components/icons/Sun'

import { Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import React, { useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

export default function ThemePicker({ mobile }: { mobile?: boolean }) {
  const { themeOption, setThemeOption } = useContext(ThemeContext)

  const iconSize = 16

  return (
    <div
      className="theme-picker"
      onClick={() =>
        setThemeOption(
          themeOption === ThemeOption.dark
            ? ThemeOption.light
            : ThemeOption.dark,
        )
      }
    >
      <React.Fragment>
        {themeOption === ThemeOption.dark ? (
          <React.Fragment>
            <Sun size={iconSize} />
            <div style={{ margin: '0 0 2px 10px' }}>
              <Trans>Light theme</Trans>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Moon size={iconSize} />
            <div style={{ margin: '0 0 2px 10px' }}>
              <Trans>Dark theme</Trans>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    </div>
  )
}
