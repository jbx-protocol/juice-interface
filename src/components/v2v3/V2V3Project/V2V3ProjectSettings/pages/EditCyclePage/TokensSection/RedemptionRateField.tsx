import { Trans } from '@lingui/macro'
import { useWatch } from 'antd/lib/form/Form'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph/TokenRedemptionRateGraph'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import NumberSlider from 'components/inputs/NumberSlider'
import { ExternalLinkWithIcon } from 'components/v2v3/V2V3Project/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { useEditCycleFormContext } from '../EditCycleFormContext'

export const zeroPercentDisabledNoticed = (
  <span className="text-tertiary text-xs">
    <Trans>(0%)</Trans>
  </span>
)

export function RedemptionRateField() {
  const { editCycleForm, setFormHasUpdated } = useEditCycleFormContext()

  // Redemption rate %
  const redemptionReductionRate = useWatch('redemptionRate', editCycleForm)

  const [redemptionRateSwitchEnabled, setRedemptionRateSwitchEnabled] =
    useState<boolean>(
      (editCycleForm?.getFieldValue('redemptionRate') ?? 100) > 0,
    )
  return (
    <div className="flex flex-col gap-5">
      <JuiceSwitch
        label={<Trans>Enable redemption rate</Trans>}
        description={
          <Trans>
            Incentivise long-term token holding with a redemption rate.{' '}
            <ExternalLinkWithIcon
              href={helpPagePath('/dev/learn/glossary/redemption-rate')}
            >
              <Trans>Learn more</Trans>
            </ExternalLinkWithIcon>
          </Trans>
        }
        value={redemptionRateSwitchEnabled}
        extra={redemptionRateSwitchEnabled ? null : zeroPercentDisabledNoticed}
        onChange={val => {
          setRedemptionRateSwitchEnabled(val)
          setFormHasUpdated(true)
          if (!val) {
            editCycleForm?.setFieldsValue({
              redemptionRate: 0,
            })
          }
        }}
      />
      {redemptionRateSwitchEnabled ? (
        <div className="flex w-full flex-col items-start justify-between gap-5 pb-5 md:flex-row md:items-center">
          <TokenRedemptionRateGraph
            value={redemptionReductionRate}
            graphPad={50}
            graphSize={200}
          />
          <NumberSlider
            name="redemptionRate"
            max={100}
            suffix="%"
            className="w-full"
          />
        </div>
      ) : null}
    </div>
  )
}
