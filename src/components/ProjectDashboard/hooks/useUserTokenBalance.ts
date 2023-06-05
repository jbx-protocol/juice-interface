import { useWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/useTotalBalanceOf'
import { useMemo } from 'react'
import { formatAmount } from 'utils/format/formatAmount'
import { fromWad } from 'utils/format/formatNumber'
import { useProjectMetadata } from './useProjectMetadata'

export const useUserTokenBalance = () => {
  const { userAddress } = useWallet()
  const { projectId } = useProjectMetadata()

  const { data: totalBalance, loading } = useTotalBalanceOf(
    userAddress,
    projectId,
  )

  const userTokenBalance = useMemo(() => {
    if (!userAddress) return undefined
    return formatAmount(fromWad(totalBalance))
  }, [totalBalance, userAddress])

  const userTokenBalanceLoading = !!userAddress && loading

  return {
    data: userTokenBalance,
    loading: userTokenBalanceLoading,
  }
}
