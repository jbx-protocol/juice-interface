import { useTokensPerEth } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useTokensPerEth'
import { useProjectSelector } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/redux/hooks'

export const useProjectPaymentTokens = () => {
  const payAmount = useProjectSelector(state => state.projectCart.payAmount)
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
