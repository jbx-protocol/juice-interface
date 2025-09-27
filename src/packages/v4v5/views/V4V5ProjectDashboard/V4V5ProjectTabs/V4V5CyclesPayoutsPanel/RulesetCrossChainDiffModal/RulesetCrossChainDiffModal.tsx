import { JBRulesetData, JBRulesetMetadata } from "juice-sdk-core"

import { t } from "@lingui/macro"
import { JuiceModal } from "components/modals/JuiceModal"

export function RulesetCrossChainDiffModal({
  open,
  setOpen,
  rulesetsDiffAcrossChains,
}: {
  open: boolean
  setOpen: () => void
  rulesetsDiffAcrossChains: Partial<JBRulesetData & JBRulesetMetadata>
}) {
  return (
    <JuiceModal
      open={open}
      setOpen={setOpen}
      okText={t`Ok`}
    >

    </JuiceModal>
  )
}
