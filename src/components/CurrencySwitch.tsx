import { CurrencyName } from 'constants/currency'
import InputAccessoryButton from './InputAccessoryButton'

export default function CurrencySwitch({
  currency,
  onCurrencyChange,
}: {
  currency: CurrencyName
  onCurrencyChange: (currency: CurrencyName) => void
}) {
  return (
    <InputAccessoryButton
      onClick={() => {
        const newCurrency = currency === 'USD' ? 'ETH' : 'USD'
        onCurrencyChange(newCurrency)
      }}
      content={currency}
      withArrow
      placement="suffix"
    />
  )
}
