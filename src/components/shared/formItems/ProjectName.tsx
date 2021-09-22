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
      name={name}
      label={hideLabel ? undefined : 'Project name'}
      {...formItemProps}
    >
      <Input
        placeholder="Peach's Juicebox Stand"
        type="string"
        autoComplete="off"
        onChange={onChange ? e => onChange(e.target.value) : undefined}
      />
    </Form.Item>
  )
}
