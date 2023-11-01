import { Trans } from '@lingui/macro'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import NumberSlider from 'components/inputs/NumberSlider'
import { ExternalLinkWithIcon } from 'components/v2v3/V2V3Project/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { useEditCycleFormContext } from '../EditCycleFormContext'
import { zeroPercentDisabledNoticed } from './RedemptionRateField'

export function IssuanceRateReductionField() {
  const { editCycleForm, setFormHasUpdated } = useEditCycleFormContext()

  // Issurance reduction rate %
  const issuanceReductionRate =
    editCycleForm?.getFieldValue('discountRate') ?? (0 as number)

  const [
    issuanceReductionRateSwitchEnabled,
    setIssuanceReductionRateSwitchEnabled,
  ] = useState<boolean>(issuanceReductionRate > 0)
  return (
    <div className="flex flex-col gap-5">
      <JuiceSwitch
        label={<Trans>Enable issuance reduction rate</Trans>}
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
            editCycleForm?.setFieldsValue({ discountRate: 0 })
          }
        }}
      />
      {issuanceReductionRateSwitchEnabled ? (
        <NumberSlider name="discountRate" max={20} suffix="%" />
      ) : null}
    </div>
  )
}
