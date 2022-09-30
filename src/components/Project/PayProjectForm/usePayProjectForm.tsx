import { CurrencyContext } from 'contexts/currencyContext'
import { CurrencyOption } from 'models/currencyOption'
import { useContext, useState } from 'react'

export function usePayProjectForm() {
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<CurrencyOption>(ETH)
  const [error, setError] = useState<boolean>(false)

  return {
    payAmount,
    setPayAmount,

    payInCurrency,
    setPayInCurrency,

    error,
    setError,
  }
}
