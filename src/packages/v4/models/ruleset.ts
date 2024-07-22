import { DecayRate, RulesetWeight } from "juice-sdk-core";
import { Hash } from "viem";

export type Ruleset = Omit<{
  cycleNumber: bigint;
  id: bigint;
  basedOnId: bigint;
  start: bigint;
  duration: bigint;
  weight: bigint;
  decayRate: bigint;
  approvalHook: Hash;
  metadata: bigint;
}, "weight" | "decayRate"> & {
  weight: RulesetWeight;
  decayRate: DecayRate;
}
