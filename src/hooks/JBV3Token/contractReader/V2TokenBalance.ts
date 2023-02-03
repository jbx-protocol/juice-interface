import { BigNumber } from '@ethersproject/bignumber'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useWallet } from 'hooks/Wallet'
import { useJBTokenStoreForV3Token } from '../contracts/JBTokenStoreForV3Token'

export function useV2TokenBalance({
  projectId,
}: {
  projectId: number | undefined
}) {
  const { userAddress } = useWallet()
  const v2TokenStoreContract = useJBTokenStoreForV3Token()

  return (
    useTotalBalanceOf(
      userAddress,
      projectId,
      undefined,
      v2TokenStoreContract,
    ) ?? BigNumber.from(0)
  )
}
