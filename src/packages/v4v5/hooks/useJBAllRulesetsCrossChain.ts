import { CashOutTaxRate, ReservedPercent, RulesetWeight, WeightCutPercent, jbControllerAbi, jbContractAddress, JBCoreContracts } from "juice-sdk-core"
import { useReadContract } from "wagmi"
import { JBChainId } from "juice-sdk-react"
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

export function useJBAllRulesetsCrossChain({
  projectId,
  rulesetNumber,
  chainId
}: {
  projectId: bigint
  rulesetNumber: bigint
  chainId: JBChainId
}) {
  const { version } = useV4V5Version()
  // For v4, use JBController4_1. For v5, use standard JBController
  const controllerAddress = version === 4
    ? jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId]
    : jbContractAddress['5'][JBCoreContracts.JBController][chainId]

  const { data, isLoading } = useReadContract({
    abi: jbControllerAbi,
    address: controllerAddress,
    functionName: 'allRulesetsOf',
    args: [
      projectId,
      rulesetNumber,
      10n, // size (The maximum number of rulesets to return). Arbritrarily set
    ],
    chainId
  })

  if (!data) return { data: undefined, isLoading }

  return {
    data: data?.map((obj) => ({
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
