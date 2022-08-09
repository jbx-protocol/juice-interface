import { UploadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { ThemeContext } from 'contexts/themeContext'
import { Split } from 'models/v2/splits'
import { ChangeEventHandler, useContext } from 'react'
import { readFile } from 'utils/file'
import { emitErrorNotification } from 'utils/notifications'
import { splitPercentFrom } from 'utils/v2/math'

/**
 * Parse a CSV file containing JB Splits.
 * @param csvContent - raw CSV content, including a header row.
 * @returns array of Split objects
 */
const parseSplitsCsvFile = (csvContent: string): Split[] => {
  // Skip the header row (the first row in the CSV file).
  const [, ...rows] = csvContent.split('\n')

  const splits: Split[] = rows.map(row => {
    const [
      beneficiary,
      percent,
      preferClaimed,
      lockedUntil,
      projectId,
      allocator,
    ] = row.split(',')

    return {
      beneficiary,
      percent: splitPercentFrom(parseFloat(percent) * 100).toNumber(),
      preferClaimed: Boolean(preferClaimed),
      lockedUntil: lockedUntil ? parseInt(lockedUntil) : undefined,
      projectId: projectId || undefined,
      allocator: allocator || undefined,
    }
  })

  return splits
}

export function SplitCsvUpload({
  onChange,
}: {
  onChange: (splits: Split[]) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const onUploadChange: ChangeEventHandler<HTMLInputElement> = async e => {
    e.preventDefault()
    e.stopPropagation()

    const { files } = e.target
    const file = files?.[0]
    if (!file) {
      emitErrorNotification(t`No file uploaded.`)
      return
    }

    try {
      const csvContent = await readFile(file)
      if (!csvContent) {
        emitErrorNotification(t`File empty or corrupt. Try again.`)
        return
      }

      const splits = parseSplitsCsvFile(csvContent)
      onChange(splits)
    } catch (e) {
      emitErrorNotification(t`File upload failed. Try again.`)
    }
  }

  return (
    <label
      style={{ cursor: 'pointer', fontWeight: 400, color: colors.text.primary }}
      role="button"
      htmlFor="csv-upload"
    >
      <UploadOutlined /> <Trans>Upload CSV</Trans>{' '}
      <TooltipIcon
        tip={
          'CSV format:\nbeneficiary, percent, preferClaimed, lockedUntil, projectId, allocator'
        }
      />
      <input
        type="file"
        hidden
        id="csv-upload"
        onChange={onUploadChange}
        // Never set the value. This allows a file of the same name to be uploaded repeatedly.
        value=""
      />
    </label>
  )
}
