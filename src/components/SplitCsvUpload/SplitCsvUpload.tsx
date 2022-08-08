import { UploadOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Split } from 'models/v2/splits'
import { ChangeEventHandler } from 'react'
import { splitPercentFrom } from 'utils/v2/math'

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readyState
const READY_STATE_DONE = 2

const readCsvFile = async (file: File): Promise<string | null> => {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = function (evt) {
      if (evt?.target?.readyState != READY_STATE_DONE) return resolve(null)
      if (evt?.target.error) {
        reject(evt.target.error)
        return
      }

      const content = evt.target.result as string | null

      resolve(content)
    }

    reader.readAsText(file)
  })
}

const parseCsvFile = (csvContent: string) => {
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
  const onUploadChange: ChangeEventHandler<HTMLInputElement> = async e => {
    e.preventDefault()
    e.stopPropagation()

    const { files } = e.target
    const file = files?.[0]
    if (!file) return

    const csvContent = await readCsvFile(file)
    if (!csvContent) return

    const splits = parseCsvFile(csvContent)
    onChange(splits)
  }

  return (
    <label
      style={{ cursor: 'pointer', fontWeight: 400 }}
      role="button"
      htmlFor="csv-upload"
    >
      <UploadOutlined /> <Trans>Upload CSV</Trans>
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
