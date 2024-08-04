import { DecayPercent, JBRulesetData, JBRulesetMetadata, RedemptionRate, ReservedPercent, RulesetWeight } from 'juice-sdk-core';
import { useJBContractContext, useReadJbControllerUpcomingRulesetOf } from 'juice-sdk-react';

// @todo: add to SDK
export function useJBUpcomingRuleset(): { 
  ruleset: JBRulesetData | undefined, 
  rulesetMetadata: JBRulesetMetadata | undefined, 
  isLoading: boolean
 } {
  const { contracts, projectId } = useJBContractContext()
  const { data, isLoading } = useReadJbControllerUpcomingRulesetOf({
    address: contracts.controller?.data ?? undefined,
    args: [projectId]
  })
  const _latestUpcomingRuleset = data?.[0]
  const _latestUpcomingRulesetMetadata = data?.[1]
  const upcomingWeight = new RulesetWeight(_latestUpcomingRuleset?.weight ?? 0n)
  const upcomingDecayPercent = new DecayPercent(_latestUpcomingRuleset?.decayPercent ?? 0)

  const latestUpcomingRuleset = _latestUpcomingRuleset
    ? {
        ..._latestUpcomingRuleset,
        weight: upcomingWeight,
        decayPercent: upcomingDecayPercent,
      }
    : undefined;

  const upcomingReservedPercent = new ReservedPercent(_latestUpcomingRulesetMetadata?.reservedPercent ?? 0)
  const upcomingRedemptionRate = new RedemptionRate(_latestUpcomingRulesetMetadata?.redemptionRate ?? 0)
  const latestUpcomingRulesetMetadata = _latestUpcomingRulesetMetadata ?
    {
      ..._latestUpcomingRulesetMetadata,
      reservedPercent: upcomingReservedPercent,
      redemptionRate: upcomingRedemptionRate,

    } : undefined

  return {
    ruleset: latestUpcomingRuleset,
    rulesetMetadata: latestUpcomingRulesetMetadata,
    isLoading
  };
}
