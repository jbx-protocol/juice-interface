import { Form, Input } from 'antd'
import React from 'react'

import { FormItemExt } from './formItemExt'

export default function ProjectLink({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Link'}
      extra="Add a URL that points to where someone could find more information about
        your project. (optional)"
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
