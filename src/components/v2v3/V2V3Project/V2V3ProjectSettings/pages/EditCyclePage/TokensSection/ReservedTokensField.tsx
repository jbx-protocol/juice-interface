import { Trans } from '@lingui/macro'
import { useWatch } from 'antd/lib/form/Form'
import { FormItems } from 'components/formItems'
import { ItemNoInput } from 'components/formItems/ItemNoInput'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { ExternalLinkWithIcon } from 'components/v2v3/V2V3Project/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { Split } from 'models/splits'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { totalSplitsPercent } from 'utils/splits'
import { SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'
import { V2V3EditReservedTokens } from '../../ReservedTokensSettingsPage/V2V3EditReservedTokens'
import { AdvancedDropdown } from '../AdvancedDropdown'
import { useEditCycleFormContext } from '../EditCycleFormContext'
import { zeroPercentDisabledNoticed } from './RedemptionRateField'

export function ReservedTokensField() {
  const { editCycleForm, setFormHasUpdated } = useEditCycleFormContext()

  const reservedTokens = useWatch('reservedTokens', editCycleForm) ?? 0
  const reservedSplits = useWatch('reservedSplits', editCycleForm) ?? []
  const totalIssuanceRate = useWatch('mintRate', editCycleForm) ?? 0

  const reservedSplitsPercentExceedsMax =
    totalSplitsPercent(reservedSplits) > SPLITS_TOTAL_PERCENT

  const [reservedTokensSwitchEnabled, setReservedTokensSwitchEnabled] =
    useState<boolean>(editCycleForm?.getFieldValue('reservedTokens') > 0)
  return (
    <div>
      <JuiceSwitch
        label={<Trans>Enable reserved tokens</Trans>}
        description={
          <Trans>
            Reserve a percentage of freshly minted tokens for specified
            recipients.{' '}
            <ExternalLinkWithIcon
              href={helpPagePath('/user/project/#reserved-rate')}
            >
              <Trans>Learn more</Trans>
            </ExternalLinkWithIcon>
          </Trans>
        }
        value={reservedTokensSwitchEnabled}
        onChange={val => {
          setReservedTokensSwitchEnabled(val)
          setFormHasUpdated(true)
          if (!val) {
            editCycleForm?.setFieldsValue({ reservedTokens: 0 })
          }
        }}
        extra={reservedTokensSwitchEnabled ? null : zeroPercentDisabledNoticed}
      />
      {reservedTokensSwitchEnabled ? (
        <div className="pt-6 pb-5">
          {/* Slider */}
          <FormItems.ProjectReserved
            hideLabel
            name="reservedTokens"
            issuanceRate={totalIssuanceRate}
            value={reservedTokens}
            hideExplainer
          />
          {/* Reserved token recipient listing */}
          <AdvancedDropdown
            title={<Trans>Reserved token recipients</Trans>}
            hideDivider
          >
            <V2V3EditReservedTokens
              editingReservedTokensSplits={reservedSplits}
              setEditingReservedTokensSplits={(splits: Split[]) => {
                editCycleForm?.setFieldsValue({
                  reservedSplits: splits,
                })
                setFormHasUpdated(true)
              }}
              hideTitle
            />
          </AdvancedDropdown>
        </div>
      ) : null}
      {reservedSplitsPercentExceedsMax ? (
        <span className="font-medium text-error-500">
          <Trans>Reserved recipients cannot exceed 100%</Trans>
        </span>
      ) : null}
      {/* Empty inputs to keep AntD useWatch happy */}
      <ItemNoInput name="reservedSplits" className="hidden" />
    </div>
  )
}
