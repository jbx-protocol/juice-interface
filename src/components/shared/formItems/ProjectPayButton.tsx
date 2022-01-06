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
      label={hideLabel ? undefined : 'Pay button text'}
      extra={`Text displayed on your project's "pay" button, max 30 characters. Leave this blank to use the default.`}
      {...formItemProps}
    >
      <Input
        placeholder="Pay"
        type="string"
        autoComplete="off"
        maxLength={30}
      />
    </Form.Item>
  )
}
