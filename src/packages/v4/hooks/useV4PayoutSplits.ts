import {
  JBSplit,
  NATIVE_TOKEN,
  SplitPortion
} from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBRuleset,
  useReadJbSplitsSplitsOf,
  useReadJbTokensTokenOf,
} from 'juice-sdk-react'

export const useV4CurrentPayoutSplits = () => {
  const { projectId } = useJBContractContext()
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: ruleset } = useJBRuleset()
  const rulesetId = BigInt(ruleset?.id ?? 0)
  const groupId = BigInt(tokenAddress ?? NATIVE_TOKEN) // contracts say this is: `uint256(uint160(tokenAddress))`

  return useReadJbSplitsSplitsOf({
    args: [projectId, rulesetId, groupId],
    query: {
      select(data) {
        return data.map(
          (d): JBSplit => ({
            ...d,
            percent: new SplitPortion(d.percent),
          }),
        )
      },
    },
  })
}
