import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingFundingCycleRecurringSelector } from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { ModRef } from 'models/payment-mod'
import { editingProjectActions } from 'redux/slices/editingProject'

export type BudgetFormFields = {
  target: string
  duration: string
  currency: CurrencyOption
  mods: ModRef[]
}

export default function BudgetForm({
  form,
  onSave,
}: {
  form: FormInstance<BudgetFormFields>
  onSave: VoidFunction
}) {
  const isRecurring = useEditingFundingCycleRecurringSelector()
  const dispatch = useAppDispatch()

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Funding specs</h1>

      <Form form={form} layout="vertical">
        <FormItems.ProjectTarget
          name="target"
          formItemProps={{
            rules: [{ required: true }],
          }}
          value={form.getFieldValue('target')}
          onValueChanged={val => form.setFieldsValue({ target: val })}
          currency={form.getFieldValue('currency')}
          onCurrencyChanged={currency => form.setFieldsValue({ currency })}
          mods={form.getFieldValue('mods')}
          onModsChanged={mods => form.setFieldsValue({ mods })}
        />
        <FormItems.ProjectDuration
          name="duration"
          value={form.getFieldValue('duration')}
          isRecurring={isRecurring}
          onToggleRecurring={() =>
            dispatch(editingProjectActions.setIsRecurring(!isRecurring))
          }
          formItemProps={{
            rules: [{ required: true }],
          }}
        />
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={onSave}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
