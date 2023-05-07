import { BigNumber } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'hooks/v1/contractReader/useTotalBalanceOf'
import { useV1TicketBoothForV3Token } from '../contracts/useV1TicketBoothForV3Token'
import { useV1ProjectId } from './useV1ProjectId'

export function useV1TotalBalance() {
  const { userAddress } = useWallet()
  const { value: v1ProjectId } = useV1ProjectId()
  const v1TicketBoothContract = useV1TicketBoothForV3Token()

  return (
    useTotalBalanceOf(
      userAddress,
      v1ProjectId,
      undefined,
      v1TicketBoothContract,
    ) ?? BigNumber.from(0)
  )
}
