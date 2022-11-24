import { Input } from 'antd'
import { TextAreaProps } from 'antd/lib/input'

export const JuiceTextArea = (props: TextAreaProps) => {
  return (
    <Input.TextArea
      className="border-smoke-300 bg-smoke-50 text-black dark:border-slate-300 dark:bg-slate-600 dark:text-slate-100"
      {...props}
    />
  )
}
