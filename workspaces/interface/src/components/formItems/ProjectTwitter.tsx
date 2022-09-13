import { t } from '@lingui/macro'
import { Form, Input } from 'antd'

import { FormItemExt } from './formItemExt'

export default function ProjectTwitter({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Twitter handle`}
      {...formItemProps}
    >
      <Input
        prefix="@"
        placeholder="juiceboxETH"
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
