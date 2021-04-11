import { Form, Input } from 'antd'
import React from 'react'

import { FormItemExt } from './formItemExt'

export default function ProjectName({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      extra="The name of your project on-chain"
      name={name}
      label={hideLabel ? undefined : 'Project name'}
      {...formItemProps}
    >
      <Input
        placeholder="Peach's Juice Stand"
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
