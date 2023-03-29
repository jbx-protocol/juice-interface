import { BigNumber } from '@ethersproject/bignumber'
import { useV1UnclaimedBalance } from 'hooks/v1/contractReader/V1UnclaimedBalance'
import { useWallet } from 'hooks/Wallet'
import { useV1TicketBoothForV3Token } from '../contracts/V1TicketBoothForV3Token'
import { useV1ProjectId } from './V1ProjectId'

export function useV1UnclaimedBalanceForV3Token() {
  const { userAddress } = useWallet()
  const { value: v1ProjectId } = useV1ProjectId()
  const v1TicketBoothContract = useV1TicketBoothForV3Token()

  return (
    useV1UnclaimedBalance({
      projectId: v1ProjectId?.toNumber(),
      userAddress,
      TicketBooth: v1TicketBoothContract,
    }) ?? BigNumber.from(0)
  )
}
