import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectHasLegacyTokens } from 'packages/v2v3/hooks/JBV3Token/contractReader/useProjectHasLegacyTokens'
import { useTotalLegacyTokenBalance } from 'packages/v2v3/hooks/JBV3Token/contractReader/useTotalLegacyTokenBalance'
import { useProjectReservedTokens } from 'packages/v2v3/hooks/contractReader/ProjectReservedTokens'
import { useV2V3WalletHasPermission } from 'packages/v2v3/hooks/contractReader/useV2V3WalletHasPermission'
import { V2V3OperatorPermission } from 'packages/v2v3/models/permissions'
import { useContext, useMemo } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useProjectContext } from './useProjectContext'
import { useProjectHasErc20Token } from './useProjectHasErc20Token'
import { useUserTokenBalanceWad } from './useUserTokenBalanceWad'

export const useTokensPanel = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const {
    tokenSymbol: tokenSymbolRaw,
    totalTokenSupply,
    tokenAddress,
    fundingCycleMetadata,
  } = useProjectContext()

  const { data: undistributedReservedTokens } = useProjectReservedTokens({
    projectId,
    reservedRate: fundingCycleMetadata?.reservedRate,
  })

  const totalTokenSupplyIncludingReserved = undistributedReservedTokens
    ? totalTokenSupply
      ? totalTokenSupply + undistributedReservedTokens
      : undefined
    : totalTokenSupply ?? undefined

  const projectToken = tokenSymbolText({
    tokenSymbol: tokenSymbolRaw,
    capitalize: false,
    plural: true,
  })
  const projectHasLegacyTokens = useProjectHasLegacyTokens()
  const hasIssueTicketsPermission = useV2V3WalletHasPermission(
    V2V3OperatorPermission.ISSUE,
  )
  const projectHasErc20Token = useProjectHasErc20Token()

  const { data: userTokenBalanceWad, loading: userTokenBalanceLoading } =
    useUserTokenBalanceWad()

  const userTokenBalance = useMemo(() => {
    if (!userTokenBalanceWad) return undefined
    return formatWad(userTokenBalanceWad, { precision: 2 })
  }, [userTokenBalanceWad])

  const { totalLegacyTokenBalance, v1ClaimedBalance } =
    useTotalLegacyTokenBalance({ projectId })

  const totalSupply = useMemo(() => {
    return formatWad(totalTokenSupplyIncludingReserved, { precision: 2 })
  }, [totalTokenSupplyIncludingReserved])

  const canCreateErc20Token = useMemo(() => {
    return !projectHasErc20Token && hasIssueTicketsPermission
  }, [hasIssueTicketsPermission, projectHasErc20Token])

  return {
    userTokenBalance,
    userTokenBalanceLoading,
    userLegacyTokenBalance: totalLegacyTokenBalance,
    projectHasLegacyTokens,
    userV1ClaimedBalance: v1ClaimedBalance,
    projectToken,
    projectTokenAddress: tokenAddress,
    totalSupply,
    projectHasErc20Token,
    canCreateErc20Token,
  }
}
