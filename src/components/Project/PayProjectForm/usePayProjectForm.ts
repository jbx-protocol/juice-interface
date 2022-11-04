import { CurrencyContext } from 'contexts/currencyContext'
import { CurrencyOption } from 'models/currencyOption'
import { Dispatch, SetStateAction, useContext, useState } from 'react'

export interface JB721DelegatePayMetadata {
  tierIdsToMint: number[]
  dontMint?: boolean
  expectMintFromExtraFunds?: boolean
  dontOverspend?: boolean
}

export type PayMetadata = JB721DelegatePayMetadata // in future, maybe more

export interface PayProjectForm {
  payAmount: string
  setPayAmount: Dispatch<SetStateAction<string>>

  payMetadata: PayMetadata | undefined
  setPayMetadata: Dispatch<SetStateAction<PayMetadata | undefined>>

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
  const [payMetadata, setPayMetadata] = useState<PayMetadata | undefined>()
  const [errorMessage, setErrorMessage] = useState<string>('')

  return {
    payAmount,
    setPayAmount,

    payMetadata,
    setPayMetadata,

    payInCurrency,
    setPayInCurrency,

    errorMessage,
    setErrorMessage,
  }
}
