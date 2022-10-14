import { Select } from 'antd'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function ThemePicker() {
  const { themeOption, setThemeOption } = useContext(ThemeContext)

  return (
    <Select value={themeOption} onChange={v => setThemeOption(v)}>
      {Object.values(ThemeOption).map(t => (
        <Select.Option key={t} value={t}>
          {t}
        </Select.Option>
      ))}
    </Select>
  )
}
