import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/useTotalBalanceOf'
import { useMemo } from 'react'

export const useUserTokenBalanceWad = () => {
  const { userAddress } = useWallet()
  const { projectId } = useProjectMetadataContext()

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
