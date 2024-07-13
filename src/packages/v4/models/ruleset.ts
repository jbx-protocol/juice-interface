import { DecayRate, RulesetWeight } from "juice-sdk-core";

export type Ruleset = Omit<{
  cycleNumber: bigint;
  id: bigint;
  basedOnId: bigint;
  start: bigint;
  duration: bigint;
  weight: bigint;
  decayRate: bigint;
  approvalHook: `0x${string}`;
  metadata: bigint;
}, "weight" | "decayRate"> & {
  weight: RulesetWeight;
  decayRate: DecayRate;
}
