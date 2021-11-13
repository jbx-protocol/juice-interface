import { Form, Input } from 'antd'

import { FormItemExt } from './formItemExt'

export default function ProjectPayButton({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Pay button'}
      extra={`Text displayed on your project\'s "pay" button. Leave this blank to use the default.`}
      {...formItemProps}
    >
      <Input placeholder="Pay" type="string" autoComplete="off" />
    </Form.Item>
  )
}
