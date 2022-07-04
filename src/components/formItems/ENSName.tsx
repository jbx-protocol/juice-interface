import { Form, Input } from 'antd'

import { t } from '@lingui/macro'

import { FormItemExt } from './formItemExt'

export default function ENSName({
  name,
  hideLabel,
  formItemProps,
  onChange,
}: {
  onChange?: (val?: string) => void
} & FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`ENS Name`}
      rules={[
        ...(formItemProps?.rules ?? []),
        {
          validator: (rule, value: string) => {
            if (value.endsWith('.eth')) {
              return Promise.reject('Do not include .eth')
            } else return Promise.resolve()
          },
        },
      ]}
      {...formItemProps}
    >
      <Input
        placeholder="juicebox"
        type="string"
        autoComplete="off"
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        suffix=".eth"
      />
    </Form.Item>
  )
}
