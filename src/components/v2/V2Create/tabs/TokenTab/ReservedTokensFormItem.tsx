import { t } from '@lingui/macro'
import { CSSProperties, useState } from 'react'

import { FormItemExt } from 'components/shared/formItems/formItemExt'
import { FormItems } from 'components/shared/formItems'
import { toMod, toSplit } from 'utils/v2/splits'
import { Split } from 'models/v2/splits'

export default function ReservedTokensFormItem({
  name,
  hideLabel,
  value,
  reserveTokenSplits,
  onReserveTokenSplitsChange,
  style = {},
  onChange,
  disabled,
  toggleDisabled,
}: {
  value: number | undefined
  reserveTokenSplits: Split[]
  onReserveTokenSplitsChange: (splits: Split[]) => void
  style?: CSSProperties
  onChange: (val?: number) => void
  disabled?: boolean
  toggleDisabled?: (checked: boolean) => void
} & FormItemExt) {
  // Using a state here because relying on the form does not
  // pass through updated reservedRate to ProjectTicketMods
  const [reservedRate, setReservedRate] = useState<number | undefined>(value)

  return (
    <div style={style}>
      <FormItems.ProjectReserved
        value={value}
        onChange={val => {
          setReservedRate(val)
          onChange(val)
        }}
        disabled={disabled}
        toggleDisabled={toggleDisabled}
        hideLabel={hideLabel}
        name={name}
      />

      {!disabled ? (
        <FormItems.ProjectTicketMods
          mods={reserveTokenSplits.map(split => toMod(split))}
          onModsChanged={mods => {
            const splits = mods.map(mod => toSplit(mod))
            onReserveTokenSplitsChange(splits)
          }}
          formItemProps={{
            label: t`Reserved token allocation (optional)`,
            extra: t`Allocate a portion of your project's reserved tokens to other Ethereum wallets or Juicebox projects.`,
          }}
          reservedRate={reservedRate ?? 0}
        />
      ) : null}
    </div>
  )
}
