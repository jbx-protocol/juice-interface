import { Button, Form, Slider, Space, Switch } from 'antd'
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
  useAdvanced
}: {
  initialDiscountRate: string
  initialBondingCurveRate: string
  onSave: (discountRate: string, bondingCurveRate: string) => void
  useAdvanced?: boolean
}) {
  const [discountRate, setDiscountRate] = useState<string>()
  const [bondingCurveRate, setBondingCurveRate] = useState<string>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useLayoutEffect(() => {
    setDiscountRate(initialDiscountRate)
    setBondingCurveRate(initialBondingCurveRate)
    setShowAdvanced(useAdvanced)
  }, [])

  const [showAdvanced, setShowAdvanced] = useState<boolean>()

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
            value={discountRate?.toString() ?? '0'}
            onChange={(val?: number) => setDiscountRate(val?.toString())}
          />
          <FormItems.ProjectBondingCurveRate
            name="bondingCurveRate"
            value={bondingCurveRate?.toString() ?? '0'}
            onChange={(val?: number) => setBondingCurveRate(val?.toString())}
          />
          {saveButton}
        </Form>
      ) : (
        <Form layout="vertical">
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Neutral</h4>
              <h4>Growth</h4>
            </div>
            <Slider
              max={4}
              min={0}
              step={1}
              tooltipVisible={false}
              dots
              onChange={val => {
                setBondingCurveRate(((4 - val) * 25).toString()) // 0 - 100 %
                setDiscountRate((val * 2).toString()) // 0 - 8 %
              }}
            />
            <div style={{ color: colors.text.secondary, marginTop: 30 }}>
              <p>
                <span style={{ color: colors.text.primary }}>
                  <span style={{ fontWeight: 600 }}>Neutral</span>
                  <br />
                  Everyone benefits equally from paying your project or
                  redeeming their tokens.
                </span>{' '}
                The number of tokens earned per amount paid is always the same.
                When redeemed for this project's overflow, tokens are always
                worth proportionally the same.
              </p>
              <p>
                <span style={{ color: colors.text.primary }}>
                  <span style={{ fontWeight: 600 }}>Growth</span>
                  <br />
                  Encourages supporters to fund your project earlier, and hold
                  their tokens instead of redeem them.
                </span>{' '}
                Payments made sooner after a project has been created will
                reward the payer with more tokens than if they paid the same
                amount later. Tokens that are redeemed first are also worth
                proportionally less than tokens that are redeemed last.
              </p>
            </div>
          </Form.Item>
          {saveButton}
        </Form>
      )}
    </Space>
  )
}
