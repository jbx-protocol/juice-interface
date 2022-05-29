import { Switch } from 'antd'
import { CSSProperties, PropsWithChildren } from 'react'

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
  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <Switch
        checked={checked}
        onChange={onChange}
        style={{ marginRight: 10 }}
        disabled={disabled}
      />
      <h3 style={{ margin: 0, lineHeight: 1 }}>{children}</h3>
    </div>
  )
}
