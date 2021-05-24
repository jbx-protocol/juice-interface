import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'

export type TicketingFormFields = {
  discountRate: string
  reserved: string
  bondingCurveRate: string
}

export default function FundingDetails({
  form,
  cycleIsRecurring,
  onSave,
}: {
  form: FormInstance<TicketingFormFields>
  cycleIsRecurring: boolean
  onSave: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>Ticketing</h1>

      <Form form={form} layout="vertical">
        <FormItems.ProjectReserved
          name="reserved"
          value={form.getFieldValue('reserved')}
          onChange={(val?: number) =>
            form.setFieldsValue({ reserved: val?.toString() })
          }
        />
        {cycleIsRecurring && (
          <FormItems.ProjectDiscountRate
            name="discountRate"
            value={form.getFieldValue('discountRate')}
            onChange={(val?: number) =>
              form.setFieldsValue({ discountRate: val?.toString() })
            }
          />
        )}
        {cycleIsRecurring && (
          <FormItems.ProjectBondingCurveRate
            name="bondingCurveRate"
            value={form.getFieldValue('bondingCurveRate')}
            onChange={(val?: number) =>
              form.setFieldsValue({ bondingCurveRate: val?.toString() })
            }
          />
        )}
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            onClick={async () => {
              await form.validateFields()
              onSave()
            }}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
