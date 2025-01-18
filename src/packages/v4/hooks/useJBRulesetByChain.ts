import { CashOutTaxRate, JBChainId, JBRulesetData, JBRulesetMetadata, ReservedPercent, RulesetWeight, WeightCutPercent } from "juice-sdk-core";
import { useJBContractContext, useReadJbControllerCurrentRulesetOf } from "juice-sdk-react";

import { useProjectIdOfChain } from "./useProjectIdOfChain";

export function useJBRulesetByChain(chainId: JBChainId | undefined) {
  const { contracts } = useJBContractContext();
  const projectId = useProjectIdOfChain({ chainId }) 
  const { data, isLoading } = useReadJbControllerCurrentRulesetOf({
    chainId,
    address: contracts?.controller?.data ?? undefined,
    args: [BigInt(projectId ?? 0)],
    query: {
      select([ruleset, rulesetMetadata]) {
        return [
          {
            ...ruleset,
            weight: new RulesetWeight(ruleset.weight),
            weightCutPercent: new WeightCutPercent(ruleset.weightCutPercent),
          },
          {
            ...rulesetMetadata,
            cashOutTaxRate: new CashOutTaxRate(rulesetMetadata.cashOutTaxRate),
            reservedPercent: new ReservedPercent(
              rulesetMetadata.reservedPercent
            ),
          },
        ];
      },
    },
  });

  if (!chainId) {
    return {
      ruleset: undefined,
      rulesetMetadata: undefined,
      isLoading: false,
    }
  }

  return {
    ruleset: data?.[0] as JBRulesetData,
    rulesetMetadata: data?.[1] as JBRulesetMetadata,
    isLoading,
  }
}
