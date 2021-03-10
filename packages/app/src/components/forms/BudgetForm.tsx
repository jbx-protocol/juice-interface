import { Form, FormProps, Input } from 'antd'
import BudgetTargetInput from 'components/shared/BudgetTargetInput'
import { BudgetCurrency } from 'models/budget-currency'
import { BudgetFormFields } from 'models/forms-fields/budget-form'
import { useEffect, useState } from 'react'

export default function BudgetForm({
  props,
  header,
  disabled,
}: {
  props: FormProps<BudgetFormFields>
  header?: JSX.Element
  disabled?: boolean
}) {
  const [currency, setCurrency] = useState<BudgetCurrency>()

  const formCurrency = props.form?.getFieldValue('currency')

  useEffect(() => setCurrency(formCurrency), [setCurrency, formCurrency])

  function toggleCurrency() {
    const newCurrency =
      props.form?.getFieldValue('currency') === '1' ? '0' : '1'

    props.form?.setFieldsValue({ currency: newCurrency })
    setCurrency(newCurrency)
  }

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
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        extra="The amount of money you want/need in order to absolutely crush your mission statement."
        name="target"
        label="Operating cost"
        rules={[{ required: true }]}
      >
        <BudgetTargetInput
          target={props.form?.getFieldValue('target')}
          currency={currency}
          onCurrencyChange={toggleCurrency}
          onValueChange={val => props.form?.setFieldsValue({ target: val })}
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
          autoComplete="off"
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
          autoComplete="off"
        />
      </Form.Item>
    </Form>
  )
}
