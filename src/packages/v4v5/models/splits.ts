import { JBSplit } from "@bananapus/nana-sdk-core"

export interface GroupedSplits<G> {
  groupId: G
  splits: JBSplit[]
}
