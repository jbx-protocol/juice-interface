import { Button, Checkbox, Form, FormInstance, Input, Space } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingBudgetRecurringSelector } from 'hooks/AppSelector'
import { BudgetCurrency } from 'models/budget-currency'
import { editingProjectActions } from 'redux/slices/editingProject'

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
  const isRecurring = useEditingBudgetRecurringSelector()
  const dispatch = useAppDispatch()

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
        <Form.Item extra="The life cycle of your project" name="duration">
          <FormattedNumberInput
            placeholder="30"
            value={form.getFieldValue('duration')}
            suffix="days"
            accessory={
              <InputAccessoryButton
                content={isRecurring ? 'recurring' : 'one-time'}
                withArrow={true}
                onClick={() =>
                  dispatch(editingProjectActions.setIsRecurring(!isRecurring))
                }
              />
            }
            onChange={val => form.setFieldsValue({ duration: val })}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={onSave}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
