import { Trans } from '@lingui/macro'
import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/formItems'

export type IncentivesFormFields = {
  discountRate: string
  bondingCurveRate: string
}

export default function IncentivesForm({
  form,
  disableBondingCurve,
  disableDiscountRate,
  onSave,
}: {
  form: FormInstance<IncentivesFormFields>
  disableBondingCurve?: boolean
  disableDiscountRate?: boolean
  onSave: (discountRate: string, bondingCurveRate: string) => void
}) {
  const discountRate = form.getFieldValue('discountRate')
  const bondingCurveRate = form.getFieldValue('bondingCurveRate')

  const saveButton = (
    <Form.Item>
      <Button
        htmlType="submit"
        type="primary"
        onClick={() => {
          if (discountRate === undefined || bondingCurveRate === undefined)
            return
          onSave(
            form.getFieldValue('discountRate'),
            form.getFieldValue('bondingCurveRate'),
          )
        }}
      >
        Save
      </Button>
    </Form.Item>
  )

  return (
    <Space direction="vertical" size="large" className="w-full">
      <h1>
        <Trans>Token rules</Trans>
      </h1>

      <Form form={form} layout="vertical">
        <FormItems.ProjectDiscountRate
          name="discountRate"
          value={discountRate}
          onChange={(val?: number) => {
            form.setFieldsValue({ discountRate: val?.toString() })
          }}
          disabled={Boolean(disableDiscountRate)}
        />

        <FormItems.ProjectRedemptionRate
          name="bondingCurveRate"
          value={form.getFieldValue('bondingCurveRate')}
          onChange={(val?: number) =>
            form.setFieldsValue({ bondingCurveRate: val?.toString() })
          }
          disabled={Boolean(disableBondingCurve)}
        />
        {saveButton}
      </Form>
    </Space>
  )
}
