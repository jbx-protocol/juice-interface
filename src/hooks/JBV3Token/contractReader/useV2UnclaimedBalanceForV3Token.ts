import { BigNumber } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import useV2ContractReader from 'hooks/v2v3/contractReader/useV2ContractReader'
import { useJBTokenStoreForV3Token } from '../contracts/useJBTokenStoreForV3Token'

export function useV2UnclaimedBalanceForV3Token({
  projectId,
}: {
  projectId: number | undefined
}) {
  const { userAddress } = useWallet()
  const v2TokenStoreContract = useJBTokenStoreForV3Token()

  return useV2ContractReader<BigNumber>({
    contract: v2TokenStoreContract,
    functionName: 'unclaimedBalanceOf',
    args:
      userAddress && projectId && v2TokenStoreContract
        ? [userAddress, projectId]
        : null,
  })
}
