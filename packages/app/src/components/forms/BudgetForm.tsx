import { Form, Input } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import BudgetTargetInput from 'components/shared/BudgetTargetInput'
import { BudgetCurrency } from 'models/budget-currency'

export type BudgetFormFields = {
  name: string
  target: string
  duration: string
  currency: BudgetCurrency
}

export default function BudgetForm({
  form,
  disabled,
}: {
  form: FormInstance<BudgetFormFields>
  disabled?: boolean
}) {
  return (
    <Form form={form} layout="vertical">
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
          autoComplete="off"
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        extra="The amount of money you want/need in order to absolutely crush your mission statement."
        name="target"
        label="Operating cost"
        rules={[{ required: true }]}
      >
        <BudgetTargetInput
          value={form.getFieldValue('target')}
          onValueChange={val => form.setFieldsValue({ target: val })}
          currency={form.getFieldValue('currency')}
          onCurrencyChange={currency =>
            form.setFieldsValue({ currency: currency === '1' ? '0' : '1' })
          }
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
          autoComplete="off"
          disabled={disabled}
        />
      </Form.Item>
    </Form>
  )
}
