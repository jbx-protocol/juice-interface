import { useJBRulesetContext } from "@bananapus/nana-sdk-react"
import { zeroAddress } from "viem"

export function useHasNftRewards() {
  const { rulesetMetadata: { data: rulesetMetadata }} =
    useJBRulesetContext()
  return (
    rulesetMetadata?.dataHook &&
    rulesetMetadata.dataHook !== zeroAddress
  )
}
