import { Form } from 'antd'
import { t } from '@lingui/macro'

import TextArea from 'antd/lib/input/TextArea'

import { FormItemExt } from './formItemExt'

export default function ProjectPayDisclosure({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Pay disclosure`}
      extra={t`Disclose any details to your supporters before they pay your project.`}
      {...formItemProps}
    >
      <TextArea autoComplete="off" />
    </Form.Item>
  )
}
