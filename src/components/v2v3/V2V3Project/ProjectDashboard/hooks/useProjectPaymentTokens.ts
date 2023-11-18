import { useProjectCart } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectCart'
import { useTokensPerEth } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useTokensPerEth'

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
