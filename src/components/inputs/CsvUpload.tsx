import { UploadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { ChangeEventHandler } from 'react'
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
      emitErrorNotification(
        t`File upload failed.` + ` ${(e as { message: string }).message ?? ''}`,
      )
      console.error(e)
    }
  }

  return (
    <div>
      <label
        className="flex cursor-pointer items-center gap-1 font-normal text-black dark:text-slate-100"
        role="button"
        htmlFor="csv-upload"
      >
        <UploadOutlined /> <Trans>Upload CSV</Trans>{' '}
        <TooltipIcon
          tip={
            <>
              <a href={templateUrl} download>
                <Trans>Download Template</Trans>
              </a>
            </>
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
    </div>
  )
}
