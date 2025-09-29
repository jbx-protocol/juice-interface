import { JBSplit, NATIVE_TOKEN, SplitPortion, jbSplitsAbi, jbTokensAbi, JBCoreContracts, jbContractAddress } from 'juice-sdk-core'
import {
  JBChainId,
  useJBProjectId,
  useJBRuleset,
  useJBContractContext,
} from 'juice-sdk-react'
import { useReadContract } from 'wagmi'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

export const useV4V5CurrentPayoutSplits = (chainId?: JBChainId) => {
  const { projectId } = useJBProjectId(chainId)
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5'

  const { contractAddress } = useJBContractContext()
  const { data: tokenAddress } = useReadContract({
    abi: jbTokensAbi,
    address: contractAddress(JBCoreContracts.JBTokens),
    functionName: 'tokenOf',
    args: [projectId ?? 0n],
  })
  const { ruleset, isLoading: rulesetIsLoading } = useJBRuleset({
    projectId,
    chainId,
  })
  const rulesetId = BigInt(ruleset?.id ?? 0)
  const groupId = BigInt(tokenAddress ?? NATIVE_TOKEN) // contracts say this is: `uint256(uint160(tokenAddress))`

  const { data, isLoading } = useReadContract({
    abi: jbSplitsAbi,
    address: jbContractAddress[versionString][JBCoreContracts.JBSplits][chainId ?? 1],
    functionName: 'splitsOf',
    args: [BigInt(projectId ?? 0), rulesetId, groupId],
    query: {
      select(data) {
        return data?.map(
          (d): JBSplit => ({
            ...d,
            percent: new SplitPortion(d.percent),
          }),
        )
      },
    },
    chainId,
  })

  if (rulesetIsLoading) return { data: undefined, isLoading: true }

  return { data, isLoading }
}
