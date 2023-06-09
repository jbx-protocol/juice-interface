import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useCallback, useMemo } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { useProjectCart } from './useProjectCart'

export const usePayProjectModal = () => {
  const { dispatch, payModalOpen, payAmount } = useProjectCart()
  const { userAddress } = useWallet()
  const converter = useCurrencyConverter()

  const open = payModalOpen
  const setOpen = useCallback(
    (open: boolean) => {
      dispatch({ type: 'setPayModal', payload: { open } })
    },
    [dispatch],
  )

  const primaryAmount = useMemo(() => {
    if (!payAmount)
      return formatCurrencyAmount({ amount: 0, currency: V2V3_CURRENCY_ETH })
    return formatCurrencyAmount(payAmount)
  }, [payAmount])

  const secondaryAmount = useMemo(() => {
    if (!payAmount) return undefined
    if (payAmount.currency === V2V3_CURRENCY_ETH) {
      const amount = Number(converter.weiToUsd(parseWad(payAmount.amount)))
      return formatCurrencyAmount({
        amount,
        currency: V2V3_CURRENCY_USD,
      })
    }
    return formatCurrencyAmount({
      amount: fromWad(converter.usdToWei(payAmount.amount)),
      currency: V2V3_CURRENCY_ETH,
    })
  }, [converter, payAmount])

  return {
    open,
    primaryAmount,
    secondaryAmount,
    userAddress,
    setOpen,
  }
}
