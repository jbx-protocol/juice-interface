import { useTokensPerEth } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useTokensPerEth'
import { useProjectSelector } from '../redux/hooks'

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
