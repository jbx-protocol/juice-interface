import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'

export function SectionCollapseHeader({
  title,
  hasDiff,
}: {
  title: React.ReactNode
  hasDiff: boolean
}) {
  const sectionHasEditsCard = (
    <Badge variant="warning">
      <Trans>Edited</Trans>
    </Badge>
  )

  const sectionNoEditsCard = (
    <Badge variant="info">
      <Trans>No changes</Trans>
    </Badge>
  )
  return (
    <div className="flex items-center gap-2">
      {title}
      {hasDiff ? sectionHasEditsCard : sectionNoEditsCard}
    </div>
  )
}
