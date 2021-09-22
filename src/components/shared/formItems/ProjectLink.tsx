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
      label={hideLabel ? undefined : 'Link (optional)'}
      extra="Add a URL that points to where someone could find more information about
        your project."
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
