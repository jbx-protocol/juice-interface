import { Switch } from 'antd'
import { FormItemInput } from 'models/formItemInput'
import { ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export const JuiceSwitch = ({
  label,
  description,
  value,
  onChange,
}: FormItemInput<boolean> & { label?: ReactNode; description?: ReactNode }) => {
  const switchId = `switch-${label}-${Math.random()}`
  return (
    <div className="flex items-start gap-2">
      <Switch
        className={classNames(
          value ? 'bg-bluebs-500' : 'bg-smoke-200 dark:bg-slate-300',
        )}
        id={switchId}
        checked={value}
        onChange={onChange}
      />
      {label && (
        <div>
          <label htmlFor={switchId} className="text-black dark:text-grey-200">
            {label}
          </label>
          {description ? (
            <div className="text-secondary text-sm">{description}</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
