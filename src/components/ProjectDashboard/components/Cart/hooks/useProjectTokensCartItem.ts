import {
  useProjectCart,
  useTokensPerEth,
} from 'components/ProjectDashboard/hooks'
import { useCallback } from 'react'

export const useProjectTokensCartItem = () => {
  const {
    totalAmount: payAmount,
    userIsReceivingTokens,
    dispatch,
  } = useProjectCart()
  const { receivedTickets } = useTokensPerEth(payAmount)

  const removeTokens = useCallback(
    () => dispatch({ type: 'removeTokens' }),
    [dispatch],
  )
  return {
    userIsReceivingTokens,
    receivedTickets,
    removeTokens,
  }
}
