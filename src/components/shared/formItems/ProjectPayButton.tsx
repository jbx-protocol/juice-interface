import { Form, Input } from 'antd'

import { FormItemExt } from './formItemExt'

export default function ProjectPayButton({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Pay button'}
      extra={``}
      {...formItemProps}
    >
      <Input
        placeholder='Text on project&apos;s "pay" button. Leave this blank to use the default.'
        type="string"
        autoComplete="off"
      />
    </Form.Item>
  )
}
