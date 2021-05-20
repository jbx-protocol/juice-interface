import { Switch } from 'antd'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import React, { useContext } from 'react'

export default function ThemePicker() {
  const { themeOption, setThemeOption } = useContext(ThemeContext)

  return (
    <div>
      <Switch
        className="theme-switcher"
        checked={themeOption === ThemeOption.dark}
        onChange={val =>
          setThemeOption(val ? ThemeOption.dark : ThemeOption.light)
        }
      />
    </div>
  )
}
