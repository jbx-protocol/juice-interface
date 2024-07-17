import { DecayRate, JBRulesetMetadata, RedemptionRate, ReservedRate, RulesetWeight } from 'juice-sdk-core';
import { useJBContractContext, useReadJbControllerUpcomingRulesetOf } from 'juice-sdk-react';
import { Ruleset } from '../models/ruleset';


// @todo: add to SDK
export function useJBUpcomingRuleset(): { 
  ruleset: Ruleset | undefined, 
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
  const upcomingDecayRate = new DecayRate(_latestUpcomingRuleset?.decayRate ?? 0n)

  const latestUpcomingRuleset = _latestUpcomingRuleset
    ? {
        ..._latestUpcomingRuleset,
        weight: upcomingWeight,
        decayRate: upcomingDecayRate,
      }
    : undefined;

  const upcomingReservedRate = new ReservedRate(_latestUpcomingRulesetMetadata?.reservedRate ?? 0n)
  const upcomingRedemptionRate = new RedemptionRate(_latestUpcomingRulesetMetadata?.redemptionRate ?? 0n)
  const latestUpcomingRulesetMetadata = _latestUpcomingRulesetMetadata ?
    {
      allowAddAccountingContext: false,
      allowAddPriceFeed: false,
      ..._latestUpcomingRulesetMetadata,
      reservedRate: upcomingReservedRate,
      redemptionRate: upcomingRedemptionRate,

    } : undefined

  return {
    ruleset: latestUpcomingRuleset,
    rulesetMetadata: latestUpcomingRulesetMetadata,
    isLoading
  };
}
