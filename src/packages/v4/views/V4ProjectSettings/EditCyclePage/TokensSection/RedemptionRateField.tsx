import { Trans } from '@lingui/macro'
import { useWatch } from 'antd/lib/form/Form'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import NumberSlider from 'components/inputs/NumberSlider'
import { CASH_OUT_TAX_RATE_EXPLANATION } from 'components/strings'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph/TokenRedemptionRateGraph'
import { useState } from 'react'
import { useEditCycleFormContext } from '../EditCycleFormContext'

export const zeroPercentDisabledNoticed = (
  <span className="text-tertiary text-xs">
    <Trans>(0%)</Trans>
  </span>
)

export function RedemptionRateField() {
  const { editCycleForm, setFormHasUpdated } = useEditCycleFormContext()

  // Cash out tax rate %
  const redemptionReductionRate = useWatch('cashOutTaxRate', editCycleForm)

  const [cashOutTaxRateSwitchEnabled, setRedemptionRateSwitchEnabled] =
    useState<boolean>(
      (editCycleForm?.getFieldValue('cashOutTaxRate') ?? 100) > 0,
    )
  return (
    <div className="flex flex-col gap-5">
      <JuiceSwitch
        label={<Trans>Enable cash outs</Trans>}
        description={
          <Trans>
            When enabled, token holders can cash out their tokens for a portion of the project's ETH treasury.
          </Trans>
        }
        value={cashOutTaxRateSwitchEnabled}
        // extra={cashOutTaxRateSwitchEnabled ? null : zeroPercentDisabledNoticed}
        onChange={val => {
          setRedemptionRateSwitchEnabled(val)
          setFormHasUpdated(true)
          if (!val) {
            editCycleForm?.setFieldsValue({
              cashOutTaxRate: 100,
            })
          } else {
            editCycleForm?.setFieldsValue({
              cashOutTaxRate: 0,
            })
          }
        }}
      />
      {cashOutTaxRateSwitchEnabled ? <span>{CASH_OUT_TAX_RATE_EXPLANATION}</span>: null}
      {cashOutTaxRateSwitchEnabled ? (
        <div className="flex w-full flex-col items-start justify-between gap-5 pb-5 md:flex-row md:items-center">
          <TokenRedemptionRateGraph
            value={100 - redemptionReductionRate}
            graphPad={50}
            graphSize={200}
          />
          <NumberSlider
            name="cashOutTaxRate"
            max={100}
            suffix="%"
            className="w-full"
          />
        </div>
      ) : null}
    </div>
  )
}
