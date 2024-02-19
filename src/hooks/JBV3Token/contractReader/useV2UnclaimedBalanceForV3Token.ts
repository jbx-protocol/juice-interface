import { useWallet } from 'hooks/Wallet'
import { useUnclaimedTokenBalance } from 'hooks/v2v3/contractReader/useUnclaimedTokenBalance'
import { useJBTokenStoreForV3Token } from '../contracts/useJBTokenStoreForV3Token'

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
