import { BigNumber } from '@ethersproject/bignumber'
import { useWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'packages/v2v3/hooks/contractReader/useTotalBalanceOf'
import { useJBTokenStoreForV3Token } from '../contracts/useJBTokenStoreForV3Token'

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
