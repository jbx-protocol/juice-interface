import { Trans } from '@lingui/macro'
import { ExternalLinkWithIcon } from 'components/ExternalLinkWithIcon'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import NumberSlider from 'components/inputs/NumberSlider'
import { useState } from 'react'
import { helpPagePath } from 'utils/helpPagePath'
import { useEditCycleFormContext } from '../EditCycleFormContext'
import { zeroPercentDisabledNoticed } from './RedemptionRateField'

// Note: "IssuanceRate" = "DecayRate"
export function IssuanceRateReductionField() {
  const { editCycleForm, setFormHasUpdated } = useEditCycleFormContext()

  // Issurance reduction rate %
  const issuanceReductionRate =
    editCycleForm?.getFieldValue('decayPercent') ?? (0 as number)

  const [
    issuanceReductionRateSwitchEnabled,
    setIssuanceReductionRateSwitchEnabled,
  ] = useState<boolean>(issuanceReductionRate > 0)
  return (
    <div className="flex flex-col gap-5">
      <JuiceSwitch
        label={<Trans>Enable decay rate</Trans>}
        description={
          <Trans>
            Reduce the total token issuance each cycle.{' '}
            <ExternalLinkWithIcon
              href={helpPagePath('/user/project/#issuance-reduction-rate')}
            >
              <Trans>Learn more</Trans>
            </ExternalLinkWithIcon>
          </Trans>
        }
        value={issuanceReductionRateSwitchEnabled}
        extra={
          issuanceReductionRateSwitchEnabled ? null : zeroPercentDisabledNoticed
        }
        onChange={val => {
          setIssuanceReductionRateSwitchEnabled(val)
          setFormHasUpdated(true)
          if (!val) {
            editCycleForm?.setFieldsValue({ decayPercent: 0 })
          }
        }}
      />
      {issuanceReductionRateSwitchEnabled ? (
        <NumberSlider name="decayPercent" max={20} suffix="%" />
      ) : null}
    </div>
  )
}
