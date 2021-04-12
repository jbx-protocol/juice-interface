import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import React from 'react'

export type FundingDetailsFormFields = {
  discountRate: string
  reserved: string
  bondingCurveRate: string
  fee: string
}

export default function FundingDetails({
  form,
  onSave,
}: {
  form: FormInstance<FundingDetailsFormFields>
  onSave: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>Extra details</h1>

      <Form form={form} layout="vertical">
        <FormItems.ProjectDiscountRate
          name="discountRate"
          value={form.getFieldValue('discountRate')}
          onChange={(val?: number) =>
            form.setFieldsValue({ discountRate: val?.toString() })
          }
        />
        <FormItems.ProjectReserved
          name="reserved"
          value={form.getFieldValue('reserved')}
          onChange={(val?: number) =>
            form.setFieldsValue({ reserved: val?.toString() })
          }
        />
        <FormItems.ProjectBondingCurveRate
          name="bondingCurveRate"
          value={form.getFieldValue('bondingCurveRate')}
          onChange={(val?: number) =>
            form.setFieldsValue({ bondingCurveRate: val?.toString() })
          }
        />
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
