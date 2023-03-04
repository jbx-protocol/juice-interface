import { Trans } from '@lingui/macro'
import { useState } from 'react'

import { FormItems } from 'components/formItems'
import { FormItemExt } from 'components/formItems/formItemExt'
import FormItemWarningText from 'components/FormItemWarningText'
import { Split } from 'models/splits'
import { DEFAULT_FUNDING_CYCLE_METADATA } from 'redux/slices/editingV2Project'
import { toMod, toSplit } from 'utils/splits'

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
          <FormItems.ProjectTicketMods
            mods={reservedTokensSplits.map(split => toMod(split))}
            onModsChanged={mods => {
              const splits = mods.map(mod => toSplit(mod))
              onReservedTokensSplitsChange(splits)
            }}
            formItemProps={{
              label: <Trans>Reserved token recipients (optional)</Trans>,
              extra: (
                <Trans>
                  Choose wallets or Juicebox projects to receive reserved
                  tokens.
                </Trans>
              ),
            }}
            reservedRate={reservedRate ?? 0}
          />
        </>
      ) : null}
    </div>
  )
}
