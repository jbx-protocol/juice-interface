import { DatePicker, DatePickerProps } from 'antd'
import { classNames } from 'utils/classNames'

export const JuiceDatePicker = (props: DatePickerProps) => {
  return (
    <DatePicker
      {...props}
      className={classNames(
        'rounded-lg border-smoke-300 bg-smoke-50 text-black dark:border-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-300',
        props.className,
      )}
    />
  )
}
