import { t } from '@lingui/macro'
import { CurrencyContext } from 'contexts/shared/CurrencyContext'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useEthBalanceQuery } from 'hooks/useEthBalance'
import { useWallet } from 'hooks/Wallet'
import { CurrencyOption } from 'models/currencyOption'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { parseWad } from 'utils/format/formatNumber'

interface JB721DELAGATE_V3_PAY_METADATA {
  tierIdsToMint: number[]
  dontMint?: boolean
  expectMintFromExtraFunds?: boolean
  dontOverspend?: boolean
}

interface JB721DELAGATE_V3_1_PAY_METADATA {
  tierIdsToMint: number[]
  allowOverspending?: boolean
}

type PayMetadata =
  | JB721DELAGATE_V3_PAY_METADATA
  | JB721DELAGATE_V3_1_PAY_METADATA // in future, maybe more

const DEFAULT_PAY_METADATA: PayMetadata = {
  tierIdsToMint: [],
}

export interface PayProjectForm {
  payAmount: string
  setPayAmount: Dispatch<SetStateAction<string>>

  payMetadata: PayMetadata | undefined
  setPayMetadata: Dispatch<SetStateAction<PayMetadata | undefined>>

  payInCurrency: CurrencyOption
  setPayInCurrency: Dispatch<SetStateAction<CurrencyOption>>

  errorMessage: string
  setErrorMessage: Dispatch<SetStateAction<string>>

  validatePayAmount: (newPayAmount: string) => void
}

export function usePayProjectForm(): PayProjectForm {
  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<CurrencyOption>(ETH)
  const [payMetadata, setPayMetadata] = useState<PayMetadata | undefined>(
    DEFAULT_PAY_METADATA,
  )
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { userAddress } = useWallet()
  const converter = useCurrencyConverter()
  const { data: userBalanceWei } = useEthBalanceQuery(userAddress)
  const userBalanceUsd = converter.wadToCurrency(userBalanceWei, 'USD', 'ETH')

  /**
   * Validate a given pay amount, and set the error message if invalid.
   */
  const validatePayAmount = (newPayAmount: string): void => {
    const payAmountWei = parseWad(newPayAmount)
    const balanceToCompare =
      payInCurrency === ETH ? userBalanceWei : userBalanceUsd

    if (balanceToCompare?.lte(payAmountWei)) {
      return setErrorMessage?.(
        t`Payment amount can't exceed your wallet balance.`,
      )
    }

    // clear previous error message if no new error was encountered.
    setErrorMessage?.('')
  }

  return {
    payAmount,
    setPayAmount,

    payMetadata,
    setPayMetadata,

    payInCurrency,
    setPayInCurrency,

    errorMessage,
    setErrorMessage,

    validatePayAmount,
  }
}
