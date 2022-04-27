import Moon from 'components/icons/Moon'
import Sun from 'components/icons/Sun'

import { ThemeContext } from 'contexts/themeContext'
import React, { CSSProperties, useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ThemePicker({ mobile }: { mobile?: boolean }) {
  const {
    themeOption,
    setThemeOption,
    theme: { colors },
  } = useContext(ThemeContext)

  const iconSize = 18
  const padding = 6
  const height = iconSize + padding * 2
  const selectedColor = colors.icon.primary
  const unselectedColor = colors.icon.tertiary

  const iconStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: padding,
    paddingBottom: padding,
  }

  const switchStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    cursor: 'pointer',
    width: iconSize * 2 + padding * 4,
    marginRight: 10,
    height,
    borderRadius: height / 2,
  }

  return (
    <div
      className="clickable-border"
      style={switchStyle}
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
        style={{
          ...iconStyle,
          color:
            themeOption === ThemeOption.light ? selectedColor : unselectedColor,
        }}
      >
        <Sun size={iconSize} />
      </div>
      <div
        style={{
          ...iconStyle,
          color:
            themeOption === ThemeOption.dark ? selectedColor : unselectedColor,
        }}
      >
        <Moon size={iconSize} />
      </div>
    </div>
  )
}
