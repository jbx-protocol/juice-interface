import { JBChainId, JBRulesetData, JBRulesetMetadata } from "juice-sdk-core";

export function getDiffedAttrBetweenRulesets(rulesetsByChain: Record<JBChainId, {
  ruleset: JBRulesetData,
  metadata: JBRulesetMetadata
}>) {
  // Get a list of all attributes we're keeping (diffed attributes)
  const diffedRulesetAttrs = Object.keys(Object.values(rulesetsByChain)[0].ruleset).filter((rulesetAttr) => (
    // @ts-ignore
    rulesets.slice(1).some(({ ruleset }) => Boolean(ruleset[rulesetAttr] !== rulesets[0][rulesetAttr]))
  ))

  const diffedMetadataAttrs = Object.keys(Object.values(rulesetsByChain)[0].metadata).filter((metadataAttr) => (
      // @ts-ignore
      rulesets.slice(1).some(({ ruleset }) => Boolean(ruleset[metadataAttr] !== rulesets[0][metadataAttr]))
    ))

  if (!diffedRulesetAttrs.length && !diffedMetadataAttrs) return []

  const rulesetsWithDiffedAttrsOnly = {} as Record<JBChainId, Partial<JBRulesetData & JBRulesetMetadata>>

  Object.keys(rulesetsByChain).map((chainIdStr) => {
    const chainId = parseInt(chainIdStr) as JBChainId
    const ruleset = rulesetsByChain[chainId].ruleset
    const metadata = rulesetsByChain[chainId].metadata
    rulesetsWithDiffedAttrsOnly[chainId] = {}
    
    diffedRulesetAttrs.forEach((rulesetAttr) => {
      // @ts-ignore
      rulesetsWithDiffedAttrsOnly[chainId][rulesetAttr] = ruleset[rulesetAttr]
    })

    diffedMetadataAttrs.forEach((metadataAttr) => {
      // @ts-ignore
      rulesetsWithDiffedAttrsOnly[chainId][metadataAttr] = metadata[rulesetAttr]
    })
  })

  return rulesetsWithDiffedAttrsOnly
}
