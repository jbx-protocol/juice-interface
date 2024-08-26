import { Trans } from '@lingui/macro'
import { useWatch } from 'antd/lib/form/Form'
import { ExternalLinkWithIcon } from 'components/ExternalLinkWithIcon'
import { FormItems } from 'components/formItems'
import { ItemNoInput } from 'components/formItems/ItemNoInput'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { AdvancedDropdown } from 'components/Project/ProjectSettings/AdvancedDropdown'
import { JBSplit, SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import { V4EditReservedTokens } from 'packages/v4/components/V4EditReservedTokens'
import { totalSplitsPercent } from 'packages/v4/utils/v4Splits'
import { useState } from 'react'
import { helpPagePath } from 'utils/helpPagePath'
import { useEditCycleFormContext } from '../EditCycleFormContext'
import { zeroPercentDisabledNoticed } from './RedemptionRateField'

export function ReservedTokensField() {
  const { editCycleForm, setFormHasUpdated } = useEditCycleFormContext()

  const reservedTokens = useWatch('reservedPercent', editCycleForm) ?? 0
  const reservedSplits = useWatch('reservedTokensSplits', editCycleForm) ?? []
  const totalIssuanceRate = useWatch('issuanceRate', editCycleForm) ?? 0

  const reservedSplitsPercentExceedsMax =
    totalSplitsPercent(reservedSplits) > SPLITS_TOTAL_PERCENT

  const [reservedTokensSwitchEnabled, setReservedTokensSwitchEnabled] =
    useState<boolean>(editCycleForm?.getFieldValue('reservedPercent') > 0)
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
            editCycleForm?.setFieldsValue({ reservedPercent: 0 })
          }
        }}
        extra={reservedTokensSwitchEnabled ? null : zeroPercentDisabledNoticed}
      />
      {reservedTokensSwitchEnabled ? (
        <div className="pt-6 pb-5">
          {/* Slider */}
          <FormItems.ProjectReserved
            hideLabel
            name="reservedPercent"
            issuanceRate={totalIssuanceRate}
            value={reservedTokens}
            hideExplainer
          />
          {/* Reserved token recipient listing */}
          <AdvancedDropdown
            title={<Trans>Reserved token recipients</Trans>}
            hideDivider
          >
            <V4EditReservedTokens
              editingReservedTokensSplits={reservedSplits}
              setEditingReservedTokensSplits={(splits: JBSplit[]) => {
                editCycleForm?.setFieldsValue({
                  reservedTokensSplits: splits,
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
      <ItemNoInput name="reservedTokensSplits" className="hidden" />
    </div>
  )
}
