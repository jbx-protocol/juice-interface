import { DecayRate, RulesetWeight } from 'juice-sdk-core';
import { useReadJbRulesetsLatestQueuedOf } from 'juice-sdk-react';
import { Ruleset } from '../models/ruleset';

export function useJBQueuedRuleset(): { data: Ruleset | undefined } {
  const { data } = useReadJbRulesetsLatestQueuedOf();
  const _latestQueuedRuleset = data?.[0];

  const queuedWeight = new RulesetWeight(_latestQueuedRuleset?.weight ?? 0n)
  const queuedDecayRate = new DecayRate(_latestQueuedRuleset?.decayRate ?? 0n)

  const latestQueuedRuleset = _latestQueuedRuleset
    ? {
        ..._latestQueuedRuleset,
        weight: queuedWeight,
        decayRate: queuedDecayRate,
      }
    : undefined;

  return {
    data: latestQueuedRuleset,
  };
}
