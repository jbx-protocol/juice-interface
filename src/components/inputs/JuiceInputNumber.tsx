import { InputNumber, InputNumberProps } from 'antd'
import { twMerge } from 'tailwind-merge'

export const JuiceInputNumber = (props: InputNumberProps) => {
  return (
    <InputNumber
      {...props}
      className={twMerge(
        'border-smoke-300 bg-smoke-50 text-black dark:border-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-300',
        props.className,
      )}
    />
  )
}
