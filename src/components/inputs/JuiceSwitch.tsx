import { Space, Switch } from 'antd'
import { FormItemInput } from 'models/formItemInput'
import { ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export const JuiceSwitch = ({
  label,
  value,
  onChange,
}: FormItemInput<boolean> & { label?: ReactNode }) => {
  const switchId = `switch-${label}`
  return (
    <Space className="flex items-baseline">
      <Switch
        className={classNames(
          value ? 'bg-haze-400' : 'bg-smoke-200 dark:bg-slate-300',
        )}
        id={switchId}
        checked={value}
        onChange={onChange}
      />
      {label && (
        <label htmlFor={switchId} className="text-black dark:text-grey-200">
          {label}
        </label>
      )}
    </Space>
  )
}
