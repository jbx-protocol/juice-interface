import { Button, Form, FormInstance, Slider, Space, Switch } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useState } from 'react'

export type IncentivesFormFields = {
  discountRate: string
  bondingCurveRate: string
}

export default function IncentivesForm({
  initialDiscountRate,
  initialBondingCurveRate,
  onSave,
}: {
  initialDiscountRate: number
  initialBondingCurveRate: number
  onSave: (discountRate: number, bondingCurveRate: number) => void
}) {
  const [discountRate, setDiscountRate] = useState<number>()
  const [bondingCurveRate, setBondingCurveRate] = useState<number>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useLayoutEffect(() => {
    setDiscountRate(initialDiscountRate)
    setBondingCurveRate(initialBondingCurveRate)
  }, [])

  const [showAdvanced, setShowAdvanced] = useState<boolean>()

  console.log('init', initialDiscountRate, initialBondingCurveRate)

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

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Incentives</h1>

      <div>
        <Space>
          <Switch onChange={setShowAdvanced} />
          <span>Show advanced settings</span>
        </Space>
      </div>

      {showAdvanced ? (
        <Form layout="vertical">
          <FormItems.ProjectDiscountRate
            name="discountRate"
            value={discountRate}
            onChange={(val?: number) => setDiscountRate(val)}
          />
          <FormItems.ProjectBondingCurveRate
            name="bondingCurveRate"
            value={bondingCurveRate}
            onChange={(val?: number) => setBondingCurveRate(val)}
          />
          {saveButton}
        </Form>
      ) : (
        <Form layout="vertical">
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Fair</h4>
              <h4>Growth</h4>
            </div>
            <Slider
              max={4}
              min={0}
              step={1}
              tooltipVisible={false}
              dots
              onChange={val => {
                setBondingCurveRate((4 - val ?? 0) * 25)
                switch (val) {
                  case 0:
                    setDiscountRate(100)
                    break
                  case 1:
                    setDiscountRate(98.5)
                    break
                  case 2:
                    setDiscountRate(97.5)
                    break
                  case 3:
                    setDiscountRate(96.5)
                    break
                  case 4:
                    setDiscountRate(95)
                    break
                }
              }}
            />
            <div style={{ color: colors.text.primary, marginTop: 30 }}>
              <p>
                <span style={{ fontWeight: 600 }}>Fair:</span> The number of
                tokens earned per amount paid to a Juicebox is always the same.
                Tokens are always worth the same amount of overflow regardless
                of when they are redeemed.
              </p>
              <p>
                <span style={{ fontWeight: 600 }}>Growth:</span> Payments made
                earlier in a Juicebox's lifetime reward the payer with more
                tokens. Tokens redeemed first are worth less than tokens
                redeemed last. This encourages users to fund your Juicebox
                early, and not redeem their tokens for overflow.
              </p>
            </div>
          </Form.Item>
          {saveButton}
        </Form>
      )}
    </Space>
  )
}
