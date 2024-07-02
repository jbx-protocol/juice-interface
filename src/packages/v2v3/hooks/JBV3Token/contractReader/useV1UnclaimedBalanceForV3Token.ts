import { useWallet } from 'hooks/Wallet'
import { useV1UnclaimedBalance } from 'packages/v1/hooks/contractReader/useV1UnclaimedBalance'
import { useV1TicketBoothForV3Token } from '../contracts/useV1TicketBoothForV3Token'
import { useV1ProjectId } from './useV1ProjectId'

export function useV1UnclaimedBalanceForV3Token() {
  const { userAddress } = useWallet()
  const { value: v1ProjectId } = useV1ProjectId()
  const v1TicketBoothContract = useV1TicketBoothForV3Token()

  return (
    useV1UnclaimedBalance({
      projectId: v1ProjectId ? Number(v1ProjectId) : undefined,
      userAddress,
      TicketBooth: v1TicketBoothContract,
    }) ?? BigInt(0)
  )
}
