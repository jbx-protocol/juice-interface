import { Form, Input } from 'antd'
import { t } from '@lingui/macro'

import { FormItemExt } from './formItemExt'

export default function ProjectDiscord({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Discord`}
      {...formItemProps}
    >
      <Input
        placeholder={t`https://discord.gg/abcdefgh`}
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
