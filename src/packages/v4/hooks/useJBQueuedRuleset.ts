import { DecayRate, RedemptionRate, ReservedRate, RulesetWeight } from 'juice-sdk-core';
import { useReadJbControllerLatestQueuedRulesetOf } from 'juice-sdk-react';
import { Ruleset } from '../models/ruleset';
import { RulesetMetadata } from '../models/rulesetMetadata';


// @todo: add to SDK
export function useJBQueuedRuleset(): { 
  ruleset: Ruleset | undefined, 
  rulesetMetadata: RulesetMetadata | undefined, 
  isLoading: boolean
 } {
  const { data, isLoading } = useReadJbControllerLatestQueuedRulesetOf()
  const _latestQueuedRuleset = data?.[0]
  const _latestQueuedRulesetMetadata = data?.[1]

  const queuedWeight = new RulesetWeight(_latestQueuedRuleset?.weight ?? 0n)
  const queuedDecayRate = new DecayRate(_latestQueuedRuleset?.decayRate ?? 0n)

  const latestQueuedRuleset = _latestQueuedRuleset
    ? {
        ..._latestQueuedRuleset,
        weight: queuedWeight,
        decayRate: queuedDecayRate,
      }
    : undefined;

  const queuedReservedRate = new ReservedRate(_latestQueuedRulesetMetadata?.reservedRate ?? 0n)
  const queuedRedemptionRate = new RedemptionRate(_latestQueuedRulesetMetadata?.redemptionRate ?? 0n)
  const latestQueuedRulesetMetadata = _latestQueuedRulesetMetadata ?
    {
      allowAddAccountingContext: false,
      allowAddPriceFeed: false,
      ..._latestQueuedRulesetMetadata,
      reservedRate: queuedReservedRate,
      redemptionRate: queuedRedemptionRate,

    } : undefined

  return {
    ruleset: latestQueuedRuleset,
    rulesetMetadata: latestQueuedRulesetMetadata,
    isLoading
  };
}
