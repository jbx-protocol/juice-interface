import { Button, Form, FormInstance, Space } from 'antd'
import { Trans } from '@lingui/macro'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

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
  disableBondingCurve?: string
  disableDiscountRate?: string
  onSave: (discountRate: string, bondingCurveRate: string) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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

  const disableTextStyle: CSSProperties = {
    color: colors.text.primary,
    fontStyle: 'italic',
    fontWeight: 500,
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>
        <Trans>Incentives</Trans>
      </h1>

      <Form form={form} layout="vertical">
        {disableDiscountRate && (
          <p style={disableTextStyle}>{disableDiscountRate}</p>
        )}
        <FormItems.ProjectDiscountRate
          name="discountRate"
          value={discountRate}
          onChange={(val?: number) => {
            form.setFieldsValue({ discountRate: val?.toString() })
          }}
          disabled={!!disableDiscountRate}
        />
        {disableBondingCurve && (
          <p style={{ ...disableTextStyle, marginTop: 60 }}>
            {disableBondingCurve}
          </p>
        )}
        <FormItems.ProjectBondingCurveRate
          name="bondingCurveRate"
          value={form.getFieldValue('bondingCurveRate')}
          onChange={(val?: number) =>
            form.setFieldsValue({ bondingCurveRate: val?.toString() })
          }
          disabled={!!disableBondingCurve}
        />
        {saveButton}
      </Form>
    </Space>
  )
}
