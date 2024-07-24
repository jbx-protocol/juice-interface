import { JBSplit, SplitPortion } from "juice-sdk-core";
import { zeroAddress } from "viem";

export const defaultSplit: JBSplit = {
  beneficiary: zeroAddress,
  percent: new SplitPortion(0),
  preferAddToBalance: false,
  lockedUntil: 0,
  projectId: 0n,
  hook: zeroAddress,
}
