import {
  useProjectCart,
  useTokensPerEth,
} from 'components/ProjectDashboard/hooks'
import { useCallback } from 'react'

export const useProjectPaymentTokens = () => {
  const {
    totalAmount: payAmount,
    userIsReceivingTokens,
    dispatch,
  } = useProjectCart()
  const { receivedTickets, receivedTokenSymbolText } =
    useTokensPerEth(payAmount)

  const removeTokens = useCallback(
    () => dispatch({ type: 'removeTokens' }),
    [dispatch],
  )
  return {
    userIsReceivingTokens,
    receivedTickets,
    receivedTokenSymbolText:
      receivedTokenSymbolText === 'tokens'
        ? 'Project'
        : receivedTokenSymbolText,
    removeTokens,
  }
}
