import { DownloadOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { GroupedSplits, Split, SplitGroup } from 'models/splits'
import { PropsWithChildren, useContext, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { emitErrorNotification } from 'utils/notifications'
import { getProjectOwnerRemainderSplit } from 'utils/splits'
import { formatSplitPercent } from 'utils/v2v3/math'

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
