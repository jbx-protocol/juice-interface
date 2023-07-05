import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { useIpfsFilePicker } from 'hooks/useIpfsFilePicker/useIpfsFilePicker'
import { twMerge } from 'tailwind-merge'

type PayProjectModalMessageInputValue = {
  messageString?: string | undefined
  attachedUrl?: string | undefined
}

type Props = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'value' | 'onChange'
> & {
  value: PayProjectModalMessageInputValue
  onChange: (value: PayProjectModalMessageInputValue) => void
}

export const MessageInput: React.FC<Props> = ({
  className,
  value,
  onChange,
  ...props
}) => {
  const acceptedFileTypes =
    'image/jpeg,image/png,image/gif,video/mp4,video/quicktime,video/x-m4v,video/webm'
  const {
    uploadedUrl,
    isUploading,
    selectedFile,
    uploadProgress,
    FileInput,
    openFilePicker,
    cancelUpload,
    removeFile,
  } = useIpfsFilePicker({
    accept: acceptedFileTypes,
    onFileUrlChange: url => onChange({ ...value, attachedUrl: url }),
  })

  return (
    <div className={className}>
      <div
        className={twMerge(
          'flex items-center justify-between rounded-lg border border-grey-300 px-3 py-2 shadow-sm dark:border-slate-600',
        )}
      >
        <input
          {...props}
          className={twMerge(
            'flex-1 bg-transparent outline-none dark:placeholder:text-slate-300',
          )}
          value={value.messageString}
          onChange={e =>
            onChange({ ...value, messageString: e.currentTarget.value })
          }
        />
        <Tooltip title={isUploading ? t`Uploading` : t`Attach an image`}>
          <button
            aria-label={t`Attach an image`}
            type="button"
            className="h-fit p-0"
            onClick={openFilePicker}
            disabled={isUploading}
          >
            <PhotoIcon
              className={twMerge(
                'h-6 w-6 text-bluebs-500',
                isUploading && 'animate-pulse',
              )}
            />
            {FileInput}
          </button>
        </Tooltip>
      </div>
      {isUploading ? (
        <div>
          <div className="mt-2 flex items-center justify-between">
            <div className="h-1 flex-1">
              <div
                role="progressbar"
                className="relative h-full w-full overflow-hidden rounded-lg bg-grey-200"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-bluebs-500"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              className="h-fit p-0"
              onClick={cancelUpload}
              aria-label="Cancel upload"
            >
              <XCircleIcon className="ml-4 h-5 w-5 flex-none text-grey-400" />
            </button>
          </div>
        </div>
      ) : (
        uploadedUrl &&
        selectedFile && (
          <div className="mt-4 flex">
            <JuiceVideoThumbnailOrImage
              className="h-12 w-12 rounded-md"
              playIconPosition="hidden"
              src={uploadedUrl}
              alt={selectedFile.name}
            />
            <button
              type="button"
              className="h-fit p-0"
              onClick={removeFile}
              aria-label="Remove attached file"
            >
              <XCircleIcon className="ml-2 h-5 w-5 flex-none text-grey-400" />
            </button>
            <span className="ml-8 max-w-xs truncate text-xs text-grey-500">
              <Trans>
                Uploaded to: <ExternalLink href={uploadedUrl} />
              </Trans>
            </span>
          </div>
        )
      )}
    </div>
  )
}
