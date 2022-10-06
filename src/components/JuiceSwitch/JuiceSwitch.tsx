import { Space, Switch } from 'antd'
import { FormItemInput } from 'models/formItemInput'
import { ReactNode } from 'react'

export const JuiceSwitch = ({
  label,
  value,
  onChange,
}: FormItemInput<boolean> & { label?: ReactNode }) => {
  return (
    <Space style={{ display: 'flex', alignItems: 'baseline' }}>
      <Switch checked={value} onChange={onChange} />
      {label && <span style={{ fontSize: '1rem' }}>{label}</span>}
    </Space>
  )
}
