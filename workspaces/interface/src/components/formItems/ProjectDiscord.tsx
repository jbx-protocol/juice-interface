import { t } from '@lingui/macro'
import { Form, Input } from 'antd'

import { FormItemExt } from './formItemExt'

export default function ProjectDiscord({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Discord link`}
      {...formItemProps}
    >
      <Input type="url" autoComplete="off" />
    </Form.Item>
  )
}
