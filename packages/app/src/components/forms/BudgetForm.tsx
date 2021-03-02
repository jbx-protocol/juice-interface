import { Form, FormProps, Input } from 'antd'
import { BudgetFormFields } from 'models/forms-fields/budget-form'

export default function BudgetForm({
  props,
  header,
  disabled,
  wantTokenName,
}: {
  props: FormProps<BudgetFormFields>
  header?: JSX.Element
  disabled?: boolean
  wantTokenName?: string
}) {
  return (
    <Form layout="vertical" {...props}>
      {header ? <Form.Item>{header}</Form.Item> : null}

      <Form.Item
        extra="How your project is identified on-chain"
        name="name"
        label="Name"
        rules={[{ required: true }]}
      >
        <Input
          className="align-end"
          placeholder="Peach's Juice Stand"
          type="string"
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        extra="The amount of money you want/need in order to absolutely crush your mission statement."
        name="target"
        label="Amount"
        rules={[{ required: true }]}
      >
        <Input
          className="align-end"
          placeholder="0"
          type="number"
          suffix={wantTokenName}
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        extra="The duration of this budgeting scope."
        name="duration"
        label="Time frame"
        rules={[{ required: true }]}
      >
        <Input
          className="align-end"
          placeholder="30"
          type="number"
          suffix="days"
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        extra="If you want, a link to your mission statement and your budgeting specs."
        name="link"
        label="Link"
      >
        <Input
          placeholder="https://docs.google.com/my-budget-info"
          disabled={disabled}
        />
      </Form.Item>
    </Form>
  )
}
