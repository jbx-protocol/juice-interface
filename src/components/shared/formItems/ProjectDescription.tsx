import { Form } from 'antd'
import { t } from '@lingui/macro'

import TextArea from 'antd/lib/input/TextArea'

import { FormItemExt } from './formItemExt'

const MAX_DESCRIPTION_LENGTH = 1000

export default function ProjectDescription({
  name,
  hideLabel,
  formItemProps,
  onChange,
}: { onChange?: (val?: string) => void } & FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Project description`}
      {...formItemProps}
      extra={t`Maximum ${MAX_DESCRIPTION_LENGTH} characters`}
    >
      <TextArea
        autoComplete="off"
        maxLength={MAX_DESCRIPTION_LENGTH}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
      />
    </Form.Item>
  )
}
