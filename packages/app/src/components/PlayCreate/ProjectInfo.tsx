import { Button, Form, FormInstance, Input, Space } from 'antd'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import { BudgetCurrency } from 'models/budget-currency'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

export type ProjectInfoFormFields = {
  name: string
  target: string
  duration: string
  currency: BudgetCurrency
}

export default function ProjectInfo({
  form,
  onSave,
}: {
  form: FormInstance<ProjectInfoFormFields>
  onSave: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>Project info</h1>

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
            onCurrencyChange={currency => form.setFieldsValue({ currency })}
          />
        </Form.Item>
        <Form.Item
          extra="The duration of this budgeting scope."
          name="duration"
          label="Time frame"
          rules={[{ required: true }]}
        >
          <FormattedNumberInput
            value={form.getFieldValue('duration')}
            onChange={val => form.setFieldsValue({ duration: val })}
            suffix="days"
          />
        </Form.Item>
      </Form>

      <Button type="primary" onClick={onSave}>
        Save
      </Button>
    </Space>
  )
}
