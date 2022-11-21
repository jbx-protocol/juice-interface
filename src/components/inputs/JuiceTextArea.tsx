import { Input } from 'antd'
import { TextAreaProps } from 'antd/lib/input'

export const JuiceTextArea = (props: TextAreaProps) => {
  return (
    <Input.TextArea
      className="text-black dark:text-slate-100 bg-smoke-50 dark:bg-slate-600 border-smoke-300 dark:border-slate-300"
      {...props}
    />
  )
}
