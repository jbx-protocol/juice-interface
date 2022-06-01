import { Switch } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, PropsWithChildren, useContext } from 'react'

export default function SwitchHeading({
  children,
  checked,
  onChange,
  disabled,
  style,
}: PropsWithChildren<{
  checked: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  style?: CSSProperties
}>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <Switch
        checked={checked}
        onChange={onChange}
        style={{ marginRight: 10 }}
        disabled={disabled}
      />
      <label
        style={{
          margin: 0,
          lineHeight: 1,
          fontSize: '1rem',
          color: colors.text.primary,
        }}
      >
        {children}
      </label>
    </div>
  )
}
