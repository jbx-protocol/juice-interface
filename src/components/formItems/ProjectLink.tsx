import { Form, Input } from 'antd'
import { t } from '@lingui/macro'

import { FormItemExt } from './formItemExt'

export default function ProjectLink({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Website`}
      {...formItemProps}
    >
      <Input type="text" autoComplete="off" />
    </Form.Item>
  )
}
