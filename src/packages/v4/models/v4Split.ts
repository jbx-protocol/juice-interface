
// TODO: JBSplit on SDK does not match V4 splits
export type V4Split = {
  preferAddToBalance: boolean,
  percent: bigint,
  projectId: bigint,
  beneficiary: `0x${string}`,
  lockedUntil: bigint,
  hook: `0x${string}`,
}
