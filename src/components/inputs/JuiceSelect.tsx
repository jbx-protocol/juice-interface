import { Select, SelectProps } from 'antd'
import { classNames } from 'utils/classNames'

export const JuiceSelect = (props: SelectProps) => {
  return (
    <Select
      {...props}
      className={classNames(
        'text-black dark:text-slate-100 bg-smoke-50 dark:bg-slate-600 border-smoke-300 dark:border-slate-300 dark:placeholder:text-slate-300',
        props.className,
      )}
    />
  )
}
