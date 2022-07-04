import { FormItemProps } from 'antd'

export type FormItemExt = {
  name?: FormItemProps['name']
  hideLabel?: boolean
  formItemProps?: Partial<Omit<FormItemProps, 'name'>>
  disabled?: boolean
}
