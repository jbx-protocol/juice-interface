import { Form, Input } from 'antd'
import React from 'react'

import { FormItemExt } from './formItemExt'

export default function ProjectLogoUri({
  name,
  formItemProps,
  hideLabel,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      extra="The URL of your logo hosted somewhere on the internet."
      label={hideLabel ? undefined : 'Logo URL (optional)'}
      {...formItemProps}
    >
      <Input
        placeholder="http://ipfs.your-host.io/your-logo.jpg"
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
