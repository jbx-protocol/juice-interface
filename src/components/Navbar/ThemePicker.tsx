import Moon from 'components/icons/Moon'
import Sun from 'components/icons/Sun'

import { Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import React, { useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

import MobileThemePicker from './MobileThemePicker'

export default function ThemePicker({ mobile }: { mobile?: boolean }) {
  const { themeOption, setThemeOption } = useContext(ThemeContext)

  const size = 18

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        cursor: 'pointer',
      }}
      onClick={() =>
        setThemeOption(
          themeOption === ThemeOption.dark
            ? ThemeOption.light
            : ThemeOption.dark,
        )
      }
    >
      {mobile ? (
        <MobileThemePicker />
      ) : (
        <React.Fragment>
          {themeOption === ThemeOption.dark ? (
            <React.Fragment>
              <Sun size={size} />
              <div style={{ margin: '0 0 2px 13px' }}>
                <Trans>Light theme</Trans>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Moon size={size} />
              <div style={{ margin: '0 0 2px 13px' }}>
                <Trans>Dark theme</Trans>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  )
}
