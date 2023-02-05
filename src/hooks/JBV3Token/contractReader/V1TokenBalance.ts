import { BigNumber } from '@ethersproject/bignumber'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useWallet } from 'hooks/Wallet'
import { useV1TicketBoothForV3Token } from '../contracts/V1TicketBoothForV3Token'
import { useV1ProjectId } from './V1ProjectId'

export function useV1TokenBalance() {
  const { userAddress } = useWallet()
  const { value: v1ProjectId } = useV1ProjectId()
  const v1TicketBookContract = useV1TicketBoothForV3Token()

  return (
    useTotalBalanceOf(
      userAddress,
      v1ProjectId,
      undefined,
      v1TicketBookContract,
    ) ?? BigNumber.from(0)
  )
}
