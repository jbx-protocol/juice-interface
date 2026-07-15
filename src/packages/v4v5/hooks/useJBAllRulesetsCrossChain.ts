import { CashOutTaxRate, JBChainId, ReservedPercent, RulesetWeight, WeightCutPercent, jbControllerAbi, jbContractAddress, JBCoreContracts, JBRulesetData, JBRulesetMetadata } from "@bananapus/nana-sdk-core"
import { useReadContract } from "wagmi"
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
  // For v4, use JBController4_1. For v5/v6, use that version's standard JBController
  const controllerAddress = version === 4
    ? jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId]
    : version === 5
    ? jbContractAddress['5'][JBCoreContracts.JBController][chainId]
    : jbContractAddress['6'][JBCoreContracts.JBController][chainId]

  // The v6 controller ABI is layout-compatible with v4/v5 for allRulesetsOf: v6 only
  // renamed the useTotalSurplusForCashOuts metadata bool to scopeCashOutsToLocalBalances
  // (with inverted meaning), which is normalized below.
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
        // On v4/v5 controllers this bit means useTotalSurplusForCashOuts, the
        // inverse of v6's scopeCashOutsToLocalBalances. Flip it so the flag
        // carries v6 semantics for every version.
        scopeCashOutsToLocalBalances:
          version === 6
            ? obj.metadata.scopeCashOutsToLocalBalances
            : !obj.metadata.scopeCashOutsToLocalBalances,
        cashOutTaxRate: new CashOutTaxRate(obj.metadata.cashOutTaxRate),
        reservedPercent: new ReservedPercent(obj.metadata.reservedPercent)
      }
    })),
    isLoading,
    refetch,
  }
}
