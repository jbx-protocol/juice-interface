import { Form, Input } from 'antd'
import { t } from '@lingui/macro'

import { FormItemExt } from './formItemExt'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'

export default function ProjectPayButton({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Pay button text`}
      extra={t`Text displayed on your project's "pay" button. Leave this blank to use the default.`}
      {...formItemProps}
    >
      <Input
        placeholder={t`Pay`}
        type="string"
        autoComplete="off"
        maxLength={PROJECT_PAY_CHARACTER_LIMIT}
        showCount
      />
    </Form.Item>
  )
}
