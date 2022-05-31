import { Form, Input } from 'antd'
import { t } from '@lingui/macro'

import { FormItemExt } from './formItemExt'

export default function ProjectTwitter({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Twitter`}
      {...formItemProps}
    >
      <Input
        prefix={t`@`}
        placeholder={t`juiceboxETH`}
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
