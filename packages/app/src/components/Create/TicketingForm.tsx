import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ModRef } from 'models/mods'
import { useLayoutEffect, useState } from 'react'

export type TicketingFormFields = {
  discountRate: string
  reserved: string
  bondingCurveRate: string
}

export default function TicketingForm({
  form,
  cycleIsRecurring,
  initialMods,
  onSave,
}: {
  form: FormInstance<TicketingFormFields>
  cycleIsRecurring: boolean
  initialMods: ModRef[]
  onSave: (mods: ModRef[]) => void
}) {
  const [mods, setMods] = useState<ModRef[]>([])

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [])

  return (
    <Space direction="vertical" size="large">
      <h1>Project tokens</h1>

      <Form form={form} layout="vertical">
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
        <FormItems.ProjectReserved
          name="reserved"
          value={form.getFieldValue('reserved')}
          onChange={(val?: number) =>
            form.setFieldsValue({ reserved: val?.toString() })
          }
        />
        <FormItems.ProjectMods
          name="ticketMods"
          mods={mods}
          onModsChanged={setMods}
          addButtonText="Add a token receiver"
          formItemProps={{
            label: 'Allocate reserved tokens (optional)',
            extra:
              "Automatically distribute a portion of your project's reserved tokens to other projects or ETH wallet addresses. Reserved tokens will be distributed as soon as they're printed.",
          }}
        />
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            onClick={async () => {
              await form.validateFields()
              onSave(mods)
            }}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
