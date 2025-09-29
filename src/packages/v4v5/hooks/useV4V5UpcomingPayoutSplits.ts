import { JBSplit, NATIVE_TOKEN, SplitPortion, jbSplitsAbi, jbTokensAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import {
  JBChainId,
  useJBProjectId,
} from 'juice-sdk-react'
import { useReadContract } from 'wagmi'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

import { useJBUpcomingRuleset } from './useJBUpcomingRuleset'

export const useV4V5UpcomingPayoutSplits = (chainId?: JBChainId) => {
  const { projectId } = useJBProjectId(chainId)
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5'

  const { ruleset: upcomingRuleset, isLoading: upcomingRulesetLoading } =
    useJBUpcomingRuleset(chainId)
  const tokensAddress = chainId ? jbContractAddress[versionString][JBCoreContracts.JBTokens][chainId] : undefined
  const splitsAddress = chainId ? jbContractAddress[versionString][JBCoreContracts.JBSplits][chainId] : undefined

  const { data: tokenAddress } = useReadContract({
    abi: jbTokensAbi,
    address: tokensAddress,
    functionName: 'tokenOf',
    args: [BigInt(projectId ?? 0)],
    chainId,
  })

  const groupId = BigInt(tokenAddress ?? NATIVE_TOKEN) // contracts say this is: `uint256(uint160(tokenAddress))`

  const { data, isLoading } = useReadContract({
    abi: jbSplitsAbi,
    address: splitsAddress,
    functionName: 'splitsOf',
    args: [BigInt(projectId ?? 0), BigInt(upcomingRuleset?.id ?? 0), groupId],
    chainId,
    query: {
      select(data) {
        return data?.map((d) => ({
          ...d,
          percent: new SplitPortion(d.percent),
        }))
      },
    },
  }) as { data: JBSplit[]; isLoading: boolean }

  if (upcomingRulesetLoading) {
    return { data: undefined, isLoading: true }
  }

  if (!projectId) return { data: undefined, isLoading: false }

  return { data, isLoading }
}
