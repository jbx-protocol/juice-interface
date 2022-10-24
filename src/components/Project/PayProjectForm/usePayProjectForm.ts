import { CurrencyContext } from 'contexts/currencyContext'
import { CurrencyOption } from 'models/currencyOption'
import { Dispatch, SetStateAction, useContext, useState } from 'react'

export interface PayProjectForm {
  payAmount: string
  setPayAmount: Dispatch<SetStateAction<string>>
  payInCurrency: CurrencyOption
  setPayInCurrency: Dispatch<SetStateAction<CurrencyOption>>
  mustBeGreaterThanZeroError: boolean
  setMustBeGreaterThanZeroError: Dispatch<SetStateAction<boolean>>
  mustBeLessThanBalanceError: boolean
  setMustBeLessThanBalanceError: Dispatch<SetStateAction<boolean>>
}

export function usePayProjectForm(): PayProjectForm {
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<CurrencyOption>(ETH)
  const [mustBeGreaterThanZeroError, setMustBeGreaterThanZeroError] =
    useState<boolean>(false)
  const [mustBeLessThanBalanceError, setMustBeLessThanBalanceError] =
    useState<boolean>(false)

  return {
    payAmount,
    setPayAmount,

    payInCurrency,
    setPayInCurrency,

    mustBeGreaterThanZeroError,
    setMustBeGreaterThanZeroError,

    mustBeLessThanBalanceError,
    setMustBeLessThanBalanceError,
  }
}
