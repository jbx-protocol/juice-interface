import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { CurrencyName } from 'constants/currency'

export function DistributionLimitInput({
  value,
  onChange,
  currencyName,
  onCurrencyChange,
  disabled,
}: {
  value: string | undefined
  onChange: (value: string | undefined) => void
  currencyName: CurrencyName
  onCurrencyChange: (currency: CurrencyName) => void
  disabled?: boolean
}) {
  const toggleCurrency = () => {
    const newCurrency = currencyName === 'ETH' ? 'USD' : 'ETH'
    onCurrencyChange(newCurrency)
  }

  return (
    <FormattedNumberInput
      placeholder="0"
      onChange={onChange}
      value={value}
      disabled={disabled}
      formItemProps={{
        rules: [{ required: true }],
        // extra: (
        // <TooltipLabel
        //   label={t`No more than this amount can be distributed from the treasury in a funding cycle.`}
        //   tip={
        //     <Trans>
        //       Each payout will receive their percent of this total each
        //       funding cycle if there is enough in the treasury. Otherwise,
        //       they will receive their percent of whatever is in the
        //       treasury.
        //     </Trans>
        //   }
        // />
        // <Trans>No more than this amount can be distributed from the treasury in a funding cycle.</Trans>
        // ),
      }}
      min={0}
      accessory={
        <InputAccessoryButton
          withArrow
          content={currencyName}
          onClick={toggleCurrency}
          disabled={disabled}
        />
      }
    />
  )
}
