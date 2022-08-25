import { DownloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/v2/splits'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { GroupedSplits, Split, SplitGroup } from 'models/v2/splits'
import { PropsWithChildren, useContext, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'

const CSV_HEADER = [
  'beneficiary',
  'percent',
  'preferClaimed',
  'lockedUntil',
  'projectId',
  'allocator',
]

const prepareSplitsCsv = (splits: Split[]): (string | undefined)[][] => {
  const csvContent = splits.map(split => {
    return [
      split.beneficiary,
      `${split.percent}`,
      `${split.preferClaimed}`,
      `${split.lockedUntil}`,
      split.projectId,
      split.allocator,
    ]
  })

  return [CSV_HEADER, ...csvContent]
}

export function ExportSplitsButton<G extends SplitGroup>({
  children,
  groupedSplits,
}: PropsWithChildren<{ groupedSplits: GroupedSplits<G> }>) {
  const { handle, projectId, fundingCycle } = useContext(V2ProjectContext)
  const [loading, setLoading] = useState<boolean>(false)

  const onExportSplitsButtonClick = () => {
    if (!groupedSplits || !fundingCycle) return

    setLoading(true)

    const csvContent = prepareSplitsCsv(groupedSplits.splits)
    const projectIdentifier = handle ? `@${handle}` : `project-${projectId}`
    const splitType =
      groupedSplits.group === ETH_PAYOUT_SPLIT_GROUP
        ? 'payouts'
        : 'reserved_tokens'
    const filename = `${projectIdentifier}_${splitType}_fc-${fundingCycle.number}`

    downloadCsvFile(filename, csvContent)

    setLoading(false)
  }

  return (
    <Button
      icon={<DownloadOutlined />}
      size="small"
      onClick={onExportSplitsButtonClick}
      loading={loading}
    >
      <span>{children}</span>
    </Button>
  )
}
