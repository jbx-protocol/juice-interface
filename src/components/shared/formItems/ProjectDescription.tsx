import { Form } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

import { FormItemExt } from './formItemExt'

export default function ProjectDescription({
  name,
  hideLabel,
  formItemProps,
  onChange,
}: { onChange?: (val?: string) => void } & FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Project description'}
      {...formItemProps}
    >
      <TextArea
        autoComplete="off"
        placeholder="Max 300 characters"
        maxLength={300}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
      />
    </Form.Item>
  )
}
