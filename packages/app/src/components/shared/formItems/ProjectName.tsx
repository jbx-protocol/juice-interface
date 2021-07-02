import { Form, Input } from 'antd'

import { FormItemExt } from './formItemExt'

export default function ProjectName({
  name,
  hideLabel,
  formItemProps,
  onChange,
}: { onChange?: (val?: string) => void } & FormItemExt) {
  return (
    <Form.Item
      extra="The name of your Juicebox."
      name={name}
      label={hideLabel ? undefined : 'Juicebox name'}
      {...formItemProps}
    >
      <Input
        placeholder="Peach's Juice Stand"
        type="string"
        autoComplete="off"
        onChange={onChange ? e => onChange(e.target.value) : undefined}
      />
    </Form.Item>
  )
}
