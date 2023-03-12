import { Trans } from '@lingui/macro'
import { useState } from 'react'

import { FormItems } from 'components/formItems'
import { FormItemExt } from 'components/formItems/formItemExt'
import FormItemWarningText from 'components/FormItemWarningText'
import { V2V3EditReservedTokens } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ReservedTokensSettingsPage/V2V3EditReservedTokens'
import { Split } from 'models/splits'
import { DEFAULT_FUNDING_CYCLE_METADATA } from 'redux/slices/editingV2Project'

export default function ReservedTokensFormItem({
  className,
  hideLabel,
  initialValue,
  reservedTokensSplits,
  onReservedTokensSplitsChange,
  onChange,
  issuanceRate,
}: {
  className?: string
  initialValue: number | undefined
  reservedTokensSplits: Split[]
  onReservedTokensSplitsChange: (splits: Split[]) => void
  onChange: (val?: number) => void
  issuanceRate?: number
} & FormItemExt) {
  // Using a state here because relying on the form does not
  // pass through updated reservedRate to ProjectTicketMods
  const [reservedRate, setReservedRate] = useState<number | undefined>(
    initialValue,
  )

  const hasReservedRate = !(
    reservedRate === undefined ||
    reservedRate.toString() === DEFAULT_FUNDING_CYCLE_METADATA.reservedRate
  )

  const [reservedRateChecked, setReservedRateChecked] =
    useState<boolean>(hasReservedRate)

  const defaultReservedRateNum = parseInt(
    DEFAULT_FUNDING_CYCLE_METADATA.reservedRate,
  )

  return (
    <div className={className}>
      <FormItems.ProjectReserved
        value={reservedRate}
        onChange={val => {
          setReservedRate(val)
          onChange(val)
        }}
        checked={reservedRateChecked}
        onToggled={checked => {
          setReservedRateChecked(checked)
          if (!checked) {
            setReservedRate(defaultReservedRateNum)
            onChange(defaultReservedRateNum)
          }
        }}
        hideLabel={hideLabel}
        issuanceRate={issuanceRate}
      />

      {(hasReservedRate && reservedRateChecked) ||
      reservedTokensSplits.length ? (
        <>
          {!hasReservedRate && (
            <FormItemWarningText>
              <Trans>
                You have added reserved token recipients, but your reserved rate
                is 0%, meaning no tokens will be reserved. Consider adding a
                reserved rate greater than 0% or removing the recipients.
              </Trans>
            </FormItemWarningText>
          )}
          <V2V3EditReservedTokens
            editingReservedTokensSplits={reservedTokensSplits}
            setEditingReservedTokensSplits={onReservedTokensSplitsChange}
          />
        </>
      ) : null}
    </div>
  )
}
