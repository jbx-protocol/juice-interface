import { Form } from 'antd'
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
      label={hideLabel ? undefined : 'Pay disclosure'}
      extra={`This text will be displayed to anyone who pays your project, before they complete their payment.`}
      {...formItemProps}
    >
      <TextArea autoComplete="off" />
    </Form.Item>
  )
}
