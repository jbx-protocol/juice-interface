import {
  useProjectCart,
  useTokensPerEth,
} from 'components/v2v3/V2V3Project/ProjectDashboard/hooks'

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
