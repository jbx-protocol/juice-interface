import { JBChainId, JBRulesetData, JBRulesetMetadata } from "juice-sdk-core";

export function getDiffedAttrBetweenRulesets(rulesetsByChain: Record<JBChainId, {
  ruleset: JBRulesetData,
  metadata: JBRulesetMetadata
}>) {
  const rulesets = Object.values(rulesetsByChain)

  if (rulesets.length === 0) return {}

  // Get a list of all attributes we're keeping (diffed attributes)
  const diffedRulesetAttrs = Object.keys(rulesets[0].ruleset).filter((rulesetAttr) => (
    // @ts-ignore
    rulesets.slice(1).some(({ ruleset }) => Boolean(ruleset[rulesetAttr] !== rulesets[0].ruleset[rulesetAttr]))
  ))

  const diffedMetadataAttrs = Object.keys(rulesets[0].metadata).filter((metadataAttr) => (
    // @ts-ignore
    rulesets.slice(1).some(({ metadata }) => Boolean(metadata[metadataAttr] !== rulesets[0].metadata[metadataAttr]))
  ))

  if (!diffedRulesetAttrs.length && !diffedMetadataAttrs.length) return {}

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
      rulesetsWithDiffedAttrsOnly[chainId][metadataAttr] = metadata[metadataAttr]
    })
  })

  return rulesetsWithDiffedAttrsOnly
}
