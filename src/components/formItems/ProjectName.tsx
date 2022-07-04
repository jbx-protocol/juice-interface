import { Form, Input } from 'antd'

import { t } from '@lingui/macro'

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
      label={hideLabel ? undefined : t`Project name`}
      {...formItemProps}
    >
      <Input
        type="string"
        autoComplete="off"
        onChange={onChange ? e => onChange(e.target.value) : undefined}
      />
    </Form.Item>
  )
}
