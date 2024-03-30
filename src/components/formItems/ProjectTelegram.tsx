import { t } from '@lingui/macro'
import { Form, Input } from 'antd'

import { FormItemExt } from './formItemExt'

export default function ProjectTelegam({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Telegram link`}
      {...formItemProps}
    >
      <Input type="url" autoComplete="off" prefix="https://" />
    </Form.Item>
  )
}
