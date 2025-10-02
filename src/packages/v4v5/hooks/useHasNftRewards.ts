import { useJBRulesetContext } from "juice-sdk-react"
import { zeroAddress } from "viem"

export function useHasNftRewards() {
  const { rulesetMetadata: { data: rulesetMetadata }} =
    useJBRulesetContext()
  return (
    rulesetMetadata?.dataHook &&
    rulesetMetadata.dataHook !== zeroAddress
  )
}
