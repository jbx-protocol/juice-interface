import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { ChangeEventHandler, useContext } from 'react'
import { readFile } from 'utils/file'
import { emitErrorNotification } from 'utils/notifications'

export function CsvUpload<T>({
  templateUrl,
  parser,
  onChange,
}: {
  templateUrl: string
  parser: (csv: string) => T[]
  onChange: (parsed: T[]) => void
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

      const parsed = parser(csvContent)
      onChange(parsed)
    } catch (e) {
      emitErrorNotification(t`File upload failed. Try again.`)
    }
  }

  return (
    <div>
      <label
        style={{
          cursor: 'pointer',
          fontWeight: 400,
          color: colors.text.primary,
        }}
        role="button"
        htmlFor="csv-upload"
      >
        <UploadOutlined /> <Trans>Upload CSV</Trans>{' '}
        <input
          type="file"
          hidden
          id="csv-upload"
          onChange={onUploadChange}
          // Never set the value. This allows a file of the same name to be uploaded repeatedly.
          value=""
        />
      </label>
      |{' '}
      <a href={templateUrl} download style={{ color: 'inherit' }}>
        <DownloadOutlined /> <Trans>Download Template</Trans>
      </a>
    </div>
  )
}
