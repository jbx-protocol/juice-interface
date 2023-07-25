import { BigNumber } from 'ethers'
import { useJBWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/useTotalBalanceOf'
import { useJBTokenStoreForV3Token } from '../contracts/useJBTokenStoreForV3Token'

export function useV2TotalBalance({
  projectId,
}: {
  projectId: number | undefined
}) {
  const { userAddress } = useJBWallet()
  const v2TokenStoreContract = useJBTokenStoreForV3Token()

  return (
    useTotalBalanceOf(userAddress, projectId, v2TokenStoreContract) ??
    BigNumber.from(0)
  )
}
