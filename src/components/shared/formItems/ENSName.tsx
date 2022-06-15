import { Form, Input } from 'antd'

import { t } from '@lingui/macro'

import { FormItemExt } from './formItemExt'

export default function ENSName({
  name,
  hideLabel,
  formItemProps,
  subdomainCount = 0,
  onChange,
}: {
  subdomainCount?: number
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
            if (value.split('.').length - 1 > subdomainCount) {
              return Promise.reject(
                subdomainCount
                  ? `Only ${subdomainCount} subdomain${
                      subdomainCount > 1 ? 's' : ''
                    } allowed`
                  : 'Subdomain not allowed',
              )
            } else if (value.endsWith('.eth')) {
              return Promise.reject('Do not include .eth')
            } else return Promise.resolve()
          },
        },
      ]}
      {...formItemProps}
    >
      <Input
        placeholder={t`juicebox`}
        type="string"
        autoComplete="off"
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        suffix=".eth"
      />
    </Form.Item>
  )
}
