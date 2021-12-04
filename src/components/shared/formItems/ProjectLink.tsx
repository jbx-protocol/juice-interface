import { Form, Input } from 'antd'

import { FormItemExt } from './formItemExt'

export default function ProjectLink({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Website'}
      extra=""
      {...formItemProps}
    >
      <Input
        placeholder="www.juicebox.money"
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
