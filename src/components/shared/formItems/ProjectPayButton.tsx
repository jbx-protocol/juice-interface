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
      label={hideLabel ? undefined : 'Twitter'}
      extra={`Text displayed on your project\'s "pay" button.`}
      {...formItemProps}
    >
      <Input placeholder="Pay" type="string" autoComplete="off" />
    </Form.Item>
  )
}
