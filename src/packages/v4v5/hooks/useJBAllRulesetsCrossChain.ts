import { CashOutTaxRate, ReservedPercent, RulesetWeight, WeightCutPercent, jbControllerAbi, jbContractAddress, JBCoreContracts, JBRulesetData, JBRulesetMetadata } from "juice-sdk-core"
import { useReadContract } from "wagmi"
import { JBChainId } from "juice-sdk-react"
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

export type RulesetWithMetadata = {
  ruleset: JBRulesetData
  metadata: JBRulesetMetadata
}

export function useJBAllRulesetsCrossChain({
  projectId,
  startingId,
  chainId,
  size = 10n,
}: {
  projectId: bigint
  /** The ruleset ID to start fetching from (going backwards). Use ruleset.id, not cycleNumber. */
  startingId: bigint
  chainId: JBChainId
  size?: bigint
}) {
  const { version } = useV4V5Version()
  // For v4, use JBController4_1. For v5, use standard JBController
  const controllerAddress = version === 4
    ? jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId]
    : jbContractAddress['5'][JBCoreContracts.JBController][chainId]

  const { data, isLoading, refetch } = useReadContract({
    abi: jbControllerAbi,
    address: controllerAddress,
    functionName: 'allRulesetsOf',
    args: [
      projectId,
      startingId,
      size,
    ],
    chainId
  })

  if (!data) return { data: undefined, isLoading, refetch }

  return {
    data: data?.map((obj): RulesetWithMetadata => ({
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
    isLoading,
    refetch,
  }
}
