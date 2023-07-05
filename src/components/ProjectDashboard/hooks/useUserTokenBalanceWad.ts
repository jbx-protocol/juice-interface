import { useWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/useTotalBalanceOf'
import { useMemo } from 'react'
import { useProjectMetadata } from './useProjectMetadata'

export const useUserTokenBalanceWad = () => {
  const { userAddress } = useWallet()
  const { projectId } = useProjectMetadata()

  const { data: totalBalance, loading } = useTotalBalanceOf(
    userAddress,
    projectId,
  )

  const userTokenBalanceWad = useMemo(() => {
    if (!userAddress) return undefined
    return totalBalance
  }, [totalBalance, userAddress])

  const userTokenBalanceLoading = !!userAddress && loading

  return {
    data: userTokenBalanceWad,
    loading: userTokenBalanceLoading,
  }
}
