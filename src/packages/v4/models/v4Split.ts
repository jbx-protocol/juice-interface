import { Hash } from "viem";

// TODO: JBSplit on SDK does not match V4 splits
export type V4Split = {
  preferAddToBalance: boolean,
  percent: bigint,
  projectId: bigint,
  beneficiary: Hash,
  lockedUntil: bigint,
  hook: Hash,
  totalValue?: bigint
}
