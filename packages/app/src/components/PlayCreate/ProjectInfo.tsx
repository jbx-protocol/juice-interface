import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingFundingCycleRecurringSelector } from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { editingProjectActions } from 'redux/slices/editingProject'

export type ProjectInfoFormFields = {
  name: string
  target: string
  duration: string
  currency: CurrencyOption
}

export default function ProjectInfo({
  form,
  onSave,
}: {
  form: FormInstance<ProjectInfoFormFields>
  onSave: VoidFunction
}) {
  const isRecurring = useEditingFundingCycleRecurringSelector()
  const dispatch = useAppDispatch()

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Project info</h1>

      <Form form={form} layout="vertical">
        <FormItems.ProjectName
          name="name"
          formItemProps={{
            rules: [{ required: true }],
          }}
        />
        <FormItems.ProjectTarget
          name="target"
          formItemProps={{
            rules: [{ required: true }],
          }}
          value={form.getFieldValue('target')}
          onValueChange={val => form.setFieldsValue({ target: val })}
          currency={form.getFieldValue('currency')}
          onCurrencyChange={currency => form.setFieldsValue({ currency })}
        />
        <FormItems.ProjectDuration
          name="duration"
          value={form.getFieldValue('duration')}
          isRecurring={isRecurring}
          onToggleRecurring={() =>
            dispatch(editingProjectActions.setIsRecurring(!isRecurring))
          }
          onChange={val => form.setFieldsValue({ duration: val })}
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
