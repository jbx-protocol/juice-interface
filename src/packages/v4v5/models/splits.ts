import { JBSplit } from "juice-sdk-core"

export interface GroupedSplits<G> {
  groupId: G
  splits: JBSplit[]
}
