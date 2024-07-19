import { t } from '@lingui/macro'
import { useJBContractContext } from 'juice-sdk-react'
import useProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { V4Split } from 'packages/v4/models/v4Split'
import { formatV4SplitPercent } from 'packages/v4/utils/math'
import { v4GetProjectOwnerRemainderSplit } from 'packages/v4/utils/v4Splits'
import { useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { emitErrorNotification } from 'utils/notifications'

const CSV_HEADER = [
  'beneficiary',
  'percent',
  'preferAddToBalance',
  'lockedUntil',
  'projectId',
  'hook',
]

const splitToCsvRow = (split: V4Split) => {
  return [
    split.beneficiary,
    `${parseFloat(formatV4SplitPercent(split.percent)) / 100}`,
    `${split.preferAddToBalance}`,
    `${split.lockedUntil}`,
    split.projectId.toString(),
    split.hook,
  ]
}

const prepareSplitsCsv = (
  splits: V4Split[],
  projectOwnerAddress: `0x${string}`,
): (string | undefined)[][] => {
  const csvContent = splits.map(splitToCsvRow)

  const rows = [CSV_HEADER, ...csvContent]

  const projectOwnerSplit = v4GetProjectOwnerRemainderSplit(
    projectOwnerAddress,
    splits,
  )
  if (projectOwnerSplit.percent > 0) {
    rows.push(splitToCsvRow(projectOwnerSplit))
  }

  return rows
}

export const useV4ExportSplitsToCsv = (
  splits: V4Split[],
  splitName = 'splits',
  fcNumber?: number,
) => {
  const { data: projectOwnerAddress } = useProjectOwnerOf()
  const { projectId } = useJBContractContext()
  const [loading, setLoading] = useState<boolean>(false)

  const handle = undefined

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
