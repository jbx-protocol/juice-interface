import { Form, Input } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'

export type TicketsFormFields = {
  name: string
  symbol: string
}

export default function TicketsForm({
  form,
  disabled,
}: {
  form: FormInstance<TicketsFormFields>
  disabled?: boolean
}) {
  function capitalizeTicker(value: string) {
    form.setFieldsValue({ symbol: value.toUpperCase() })
  }

  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        extra="The name of your ticket token is used across web3."
        name="name"
        label="Name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Peach's" disabled={disabled} autoComplete="off" />
      </Form.Item>
      <Form.Item
        extra="The ticker of your ticket token is used across web3."
        name="symbol"
        label="Ticker"
        rules={[{ required: true }]}
      >
        <Input
          placeholder="PEACH"
          onChange={e => capitalizeTicker(e.target.value)}
          disabled={disabled}
          autoComplete="off"
        />
      </Form.Item>
    </Form>
  )
}
