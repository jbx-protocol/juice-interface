import { useJBContractContext, useJBRuleset, useReadJbSplitsSplitsOf, useReadJbTokensTokenOf } from 'juice-sdk-react'
import { V4Split } from 'packages/v4/models/v4Split'

export const useV4CurrentPayoutSplits = () => {
  const { projectId } = useJBContractContext()
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: ruleset } = useJBRuleset()

  const groupId = BigInt(tokenAddress ?? 0) // contracts say this is: `uint256(uint160(tokenAddress))`
  const { data: _splits, isLoading: currentSplitsLoading } = useReadJbSplitsSplitsOf({
    args: [
      projectId, 
      ruleset?.id ?? 0n, 
      groupId
    ],
  })

  const splits: V4Split[] = _splits ? [..._splits] : []

  return { splits, isLoading: currentSplitsLoading }
}
