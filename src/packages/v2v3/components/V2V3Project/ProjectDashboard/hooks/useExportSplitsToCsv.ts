import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { Split } from 'packages/v2v3/models/splits'
import { formatSplitPercent } from 'packages/v2v3/utils/math'
import { getProjectOwnerRemainderSplit } from 'packages/v2v3/utils/v2v3Splits'
import { useContext, useState } from 'react'
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

export const useExportSplitsToCsv = (
  splits: Split[],
  splitName = 'splits',
  fcNumber?: number,
) => {
  const { handle, projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const [loading, setLoading] = useState<boolean>(false)

  const exportSplitsToCsv = () => {
    if (!splits || !projectOwnerAddress) {
      emitErrorNotification(
        t`CSV data wasn't ready for export. Wait a few seconds and try again.`,
      )
      return
    }

    setLoading(true)

    try {
      const csvContent = prepareSplitsCsv(splits, projectOwnerAddress)
      const projectIdentifier = handle ? `@${handle}` : `project-${projectId}`
      const filename = `${projectIdentifier}_${splitName}${
        fcNumber ? `_fc-${fcNumber}` : ''
      }`

      downloadCsvFile(filename, csvContent)
    } catch (e) {
      console.error(e)
      emitErrorNotification(t`CSV download failed.`)
    } finally {
      setLoading(false)
    }
  }

  return { exportSplitsToCsv, loading }
}
