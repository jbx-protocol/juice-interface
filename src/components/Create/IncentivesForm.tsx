import { Button, Form, Space } from 'antd'
import { Trans } from '@lingui/macro'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext, useLayoutEffect, useState } from 'react'

export type IncentivesFormFields = {
  discountRate: string
  bondingCurveRate: string
}

export default function IncentivesForm({
  initialDiscountRate,
  initialBondingCurveRate,
  disableBondingCurve,
  disableDiscountRate,
  onSave,
}: {
  initialDiscountRate: string
  initialBondingCurveRate: string
  disableBondingCurve?: string
  disableDiscountRate?: string
  onSave: (discountRate: string, bondingCurveRate: string) => void
}) {
  const [discountRate, setDiscountRate] = useState<string>()
  const [bondingCurveRate, setBondingCurveRate] = useState<string>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useLayoutEffect(() => {
    setDiscountRate(initialDiscountRate)
    setBondingCurveRate(initialBondingCurveRate)
  }, [initialBondingCurveRate, initialDiscountRate])

  const saveButton = (
    <Form.Item>
      <Button
        htmlType="submit"
        type="primary"
        onClick={() => {
          if (discountRate === undefined || bondingCurveRate === undefined)
            return
          onSave(discountRate, bondingCurveRate)
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

      <Form layout="vertical">
        {disableDiscountRate && (
          <p style={disableTextStyle}>{disableDiscountRate}</p>
        )}
        <FormItems.ProjectDiscountRate
          name="discountRate"
          value={discountRate?.toString() ?? '0'}
          onChange={(val?: number) => setDiscountRate(val?.toString())}
          disabled={!!disableDiscountRate}
        />
        {disableBondingCurve && (
          <p style={{ ...disableTextStyle, marginTop: 60 }}>
            {disableBondingCurve}
          </p>
        )}
        <FormItems.ProjectBondingCurveRate
          name="bondingCurveRate"
          value={bondingCurveRate?.toString() ?? '100'}
          onChange={(val?: number) => setBondingCurveRate(val?.toString())}
          disabled={!!disableBondingCurve}
        />
        {saveButton}
      </Form>
    </Space>
  )
}
