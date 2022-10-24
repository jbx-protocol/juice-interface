import { CurrencyContext } from 'contexts/currencyContext'
import { CurrencyOption } from 'models/currencyOption'
import { Dispatch, SetStateAction, useContext, useState } from 'react'

export interface PayProjectForm {
  payAmount: string
  setPayAmount: Dispatch<SetStateAction<string>>
  payInCurrency: CurrencyOption
  setPayInCurrency: Dispatch<SetStateAction<CurrencyOption>>
  errorMessage: string
  setErrorMessage: Dispatch<SetStateAction<string>>
}

export function usePayProjectForm(): PayProjectForm {
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<CurrencyOption>(ETH)
  const [errorMessage, setErrorMessage] = useState<string>('')

  return {
    payAmount,
    setPayAmount,

    payInCurrency,
    setPayInCurrency,

    errorMessage,
    setErrorMessage,
  }
}
