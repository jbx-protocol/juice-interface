import { CashOutTaxRate, ReservedPercent, RulesetWeight, WeightCutPercent } from "juice-sdk-core"

import { useReadJbControllerAllRulesetsOf } from "juice-sdk-react"

export function useJBAllRulesetsCrossChain({
  projectId,
  rulesetNumber
}: {
  projectId: bigint
  rulesetNumber: bigint
}) {
  const { data, isLoading } = useReadJbControllerAllRulesetsOf({
    args: [
      projectId, 
      rulesetNumber, 
      10n, // size (The maximum number of rulesets to return). Arbritrarily set
    ]
  })

  if (!data) return { data: undefined, isLoading }

  return {
    data: data.map((obj) => ({
      ruleset: {
        ...obj.ruleset, 
        weight: new RulesetWeight(obj.ruleset.weight), 
        weightCutPercent: new WeightCutPercent(obj.ruleset.weightCutPercent), 
      },
      metadata: {
        ...obj.metadata,
        cashOutTaxRate: new CashOutTaxRate(obj.metadata.cashOutTaxRate),
        reservedPercent: new ReservedPercent(obj.metadata.reservedPercent)
      }
    })),
    isLoading
  }
}
