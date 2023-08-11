import { Trans } from '@lingui/macro'
import { useWatch } from 'antd/lib/form/Form'
import { ExternalLinkWithIcon } from 'components/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { TokenRedemptionRateGraph } from 'components/TokenRedemptionRateGraph'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import NumberSlider from 'components/inputs/NumberSlider'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { useEditCycleFormContext } from '../EditCycleFormContext'

export function RedemptionRateField() {
  const { editCycleForm } = useEditCycleFormContext()

  // Redemption rate %
  const redemptionReductionRate = useWatch('redemptionRate', editCycleForm)

  const [redemptionRateSwitchEnabled, setRedemptionRateSwitchEnabled] =
    useState<boolean>(
      editCycleForm?.getFieldValue('redemptionRate') ?? 100 < 100,
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
        onChange={val => {
          setRedemptionRateSwitchEnabled(val)
          if (!val) {
            editCycleForm?.setFieldsValue({
              redemptionRate: 100,
            })
          }
        }}
      />
      {redemptionRateSwitchEnabled ? (
        <div className="flex w-full items-center justify-between gap-5 pb-5">
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
