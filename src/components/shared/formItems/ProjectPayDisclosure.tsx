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
      label={hideLabel ? undefined : 'A note to your supporters'}
      extra={``}
      {...formItemProps}
    >
      <TextArea
        placeholder="This text will be displayed to anyone who pays your project, before they complete their payment."
        autoComplete="off"
      />
    </Form.Item>
  )
}
