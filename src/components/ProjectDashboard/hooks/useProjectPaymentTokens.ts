import {
  useProjectCart,
  useTokensPerEth,
} from 'components/ProjectDashboard/hooks'

export const useProjectPaymentTokens = () => {
  const { totalAmount: payAmount } = useProjectCart()
  const { receivedTickets, receivedTokenSymbolText } =
    useTokensPerEth(payAmount)

  return {
    receivedTickets,
    receivedTokenSymbolText:
      receivedTokenSymbolText === 'tokens'
        ? 'Project'
        : receivedTokenSymbolText,
  }
}
