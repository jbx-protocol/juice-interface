import { Button, Checkbox, Form, FormInstance, Input, Space } from 'antd'
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
        <Form.Item>
          <div style={{ display: 'flex' }}>
            <Checkbox
              defaultChecked={isRecurring}
              onChange={e =>
                dispatch(editingProjectActions.setIsRecurring(e.target.checked))
              }
            ></Checkbox>
            <div style={{ marginLeft: 10 }}>Use a recurring funding target</div>
          </div>
        </Form.Item>
        {isRecurring ? (
          <Form.Item
            extra="The time period of this recurring budget"
            name="duration"
          >
            <FormattedNumberInput
              placeholder="30"
              value={form.getFieldValue('duration')}
              suffix="days"
              onChange={val => form.setFieldsValue({ duration: val })}
            />
          </Form.Item>
        ) : null}
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={onSave}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
