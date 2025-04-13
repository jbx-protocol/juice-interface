import { Trans } from '@lingui/macro'
import { useWatch } from 'antd/lib/form/Form'
import { ExternalLinkWithIcon } from 'components/ExternalLinkWithIcon'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import NumberSlider from 'components/inputs/NumberSlider'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph/TokenRedemptionRateGraph'
import { useState } from 'react'
import { helpPagePath } from 'utils/helpPagePath'
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
        label={<Trans>Enable cash out tax rate</Trans>}
        description={
          <Trans>
            Incentivise long-term token holding with a cash out tax rate.{' '}
            <ExternalLinkWithIcon
              href={helpPagePath('/dev/learn/glossary/redemption-rate')}
            >
              <Trans>Learn more</Trans>
            </ExternalLinkWithIcon>
          </Trans>
        }
        value={cashOutTaxRateSwitchEnabled}
        extra={cashOutTaxRateSwitchEnabled ? null : zeroPercentDisabledNoticed}
        onChange={val => {
          setRedemptionRateSwitchEnabled(val)
          setFormHasUpdated(true)
          if (!val) {
            editCycleForm?.setFieldsValue({
              cashOutTaxRate: 0,
            })
          }
        }}
      />
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
