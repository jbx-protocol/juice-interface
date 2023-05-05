import { BigNumber } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/TotalBalanceOf'
import { useJBTokenStoreForV3Token } from '../contracts/JBTokenStoreForV3Token'

export function useV2TotalBalance({
  projectId,
}: {
  projectId: number | undefined
}) {
  const { userAddress } = useWallet()
  const v2TokenStoreContract = useJBTokenStoreForV3Token()

  return (
    useTotalBalanceOf(userAddress, projectId, v2TokenStoreContract) ??
    BigNumber.from(0)
  )
}
