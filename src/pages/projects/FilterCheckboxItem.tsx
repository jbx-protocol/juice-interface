import { Checkbox } from 'antd'
import { classNames } from 'utils/classNames'
import { CheckboxOnChange } from './ProjectsFilterAndSort'

export default function FilterCheckboxItem({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: CheckboxOnChange
  disabled?: boolean
}) {
  return (
    <div
      className={classNames(
        'flex h-10 cursor-pointer items-center',
        disabled ? 'text-grey-400 dark:text-slate-200' : '',
      )}
      onClick={() => onChange(!checked)}
    >
      <Checkbox
        className="mr-2"
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={disabled}
      />
      {label}
    </div>
  )
}
