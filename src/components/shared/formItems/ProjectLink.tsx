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
      extra={t`Your project's website.`}
      {...formItemProps}
    >
      <Input
        placeholder={t`https://your-project.com`}
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
