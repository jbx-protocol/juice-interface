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
      extra="Your project's website."
      {...formItemProps}
    >
      <Input
        placeholder="http://your-project.com"
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
