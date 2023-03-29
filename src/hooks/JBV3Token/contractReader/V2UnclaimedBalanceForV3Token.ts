import { useUnclaimedTokenBalance } from 'hooks/v2v3/contractReader/UnclaimedTokenBalance'
import { useWallet } from 'hooks/Wallet'
import { useJBTokenStoreForV3Token } from '../contracts/JBTokenStoreForV3Token'

export function useV2UnclaimedBalanceForV3Token({
  projectId,
}: {
  projectId: number | undefined
}) {
  const { userAddress } = useWallet()
  const v2TokenStoreContract = useJBTokenStoreForV3Token()

  return useUnclaimedTokenBalance({
    userAddress,
    projectId,
    JBTokenStore: v2TokenStoreContract,
  })
}
