import { DownloadOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { GroupedSplits, Split, SplitGroup } from 'packages/v2v3/models/splits'
import { formatSplitPercent } from 'packages/v2v3/utils/math'
import { getProjectOwnerRemainderSplit } from 'packages/v2v3/utils/v2v3Splits'
import { PropsWithChildren, useContext, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { emitErrorNotification } from 'utils/notifications'

const CSV_HEADER = [
  'beneficiary',
  'percent',
  'preferClaimed',
  'lockedUntil',
  'projectId',
  'allocator',
]

const splitToCsvRow = (split: Split) => {
  return [
    split.beneficiary,
    `${parseFloat(formatSplitPercent(BigNumber.from(split.percent))) / 100}`,
    `${split.preferClaimed}`,
    `${split.lockedUntil}`,
    split.projectId,
    split.allocator,
  ]
}

const prepareSplitsCsv = (
  splits: Split[],
  projectOwnerAddress: string,
): (string | undefined)[][] => {
  const csvContent = splits.map(splitToCsvRow)

  const rows = [CSV_HEADER, ...csvContent]

  const projectOwnerSplit = getProjectOwnerRemainderSplit(
    projectOwnerAddress,
    splits,
  )
  if (projectOwnerSplit.percent > 0) {
    rows.push(splitToCsvRow(projectOwnerSplit))
  }

  return rows
}

export function ExportSplitsButton<G extends SplitGroup>({
  children,
  groupedSplits,
}: PropsWithChildren<{ groupedSplits: GroupedSplits<G> }>) {
  const { handle, fundingCycle, projectOwnerAddress } =
    useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const [loading, setLoading] = useState<boolean>(false)

  const onExportSplitsButtonClick = () => {
    if (!groupedSplits || !fundingCycle || !projectOwnerAddress) {
      emitErrorNotification(
        t`CSV data wasn't ready for export. Wait a few seconds and try again.`,
      )
      return
    }

    setLoading(true)

    try {
      const csvContent = prepareSplitsCsv(
        groupedSplits.splits,
        projectOwnerAddress,
      )
      const projectIdentifier = handle ? `@${handle}` : `project-${projectId}`
      const splitType =
        groupedSplits.group === ETH_PAYOUT_SPLIT_GROUP
          ? 'payouts'
          : 'reserved-tokens'
      const filename = `${projectIdentifier}_${splitType}_fc-${fundingCycle.number}`

      downloadCsvFile(filename, csvContent)
    } catch (e) {
      console.error(e)
      emitErrorNotification(t`CSV download failed.`)
    } finally {
      setLoading(false)
    }
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
