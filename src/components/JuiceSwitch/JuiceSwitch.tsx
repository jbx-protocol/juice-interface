import { Space, Switch } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { FormItemInput } from 'models/formItemInput'
import { ReactNode, useContext } from 'react'

export const JuiceSwitch = ({
  label,
  value,
  onChange,
}: FormItemInput<boolean> & { label?: ReactNode }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const switchId = `switch-${label}`
  return (
    <Space style={{ display: 'flex', alignItems: 'baseline' }}>
      <Switch id={switchId} checked={value} onChange={onChange} />
      {label && (
        <label htmlFor={switchId} style={{ color: colors.text.primary }}>
          {label}
        </label>
      )}
    </Space>
  )
}
