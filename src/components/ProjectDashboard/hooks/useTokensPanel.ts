import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { constants } from 'ethers'
import { useTotalLegacyTokenBalance } from 'hooks/JBV3Token/contractReader/useTotalLegacyTokenBalance'
import { useContext, useMemo } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useProjectContext } from './useProjectContext'
import { useUserTokenBalanceWad } from './useUserTokenBalanceWad'

export const useTokensPanel = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const {
    tokenSymbol: tokenSymbolRaw,
    totalTokenSupply,
    tokenAddress,
  } = useProjectContext()
  const projectToken = tokenSymbolText({
    tokenSymbol: tokenSymbolRaw,
    capitalize: false,
    plural: true,
  })
  const { data: userTokenBalanceWad, loading: userTokenBalanceLoading } =
    useUserTokenBalanceWad()

  const userTokenBalance = useMemo(() => {
    if (!userTokenBalanceWad) return undefined
    return formatWad(userTokenBalanceWad, { precision: 2 })
  }, [userTokenBalanceWad])

  const { totalLegacyTokenBalance, v1ClaimedBalance } =
    useTotalLegacyTokenBalance({ projectId })

  const totalSupply = useMemo(() => {
    return formatWad(totalTokenSupply, { precision: 2 })
  }, [totalTokenSupply])

  const projectHasErc20Token = useMemo(
    () => tokenAddress !== undefined && tokenAddress !== constants.AddressZero,
    [tokenAddress],
  )

  return {
    userTokenBalance,
    userTokenBalanceLoading,
    userLegacyTokenBalance: totalLegacyTokenBalance,
    userV1ClaimedBalance: v1ClaimedBalance,
    projectToken,
    projectTokenAddress: tokenAddress,
    totalSupply,
    projectHasErc20Token,
  }
}
