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
      <Input
        placeholder={t`https://your-project.com`}
        type="url"
        autoComplete="off"
      />
    </Form.Item>
  )
}
