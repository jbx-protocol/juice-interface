import { EnvelopeIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Callout } from 'components/Callout'
import ExternalLink from 'components/ExternalLink'
import {
  PayProjectModalFormValues,
  usePayProjectModal,
} from 'components/ProjectDashboard/hooks/usePayProjectModal'
import { useFormikContext } from 'formik'
import { useIpfsFilePicker } from 'hooks/useIpfsFilePicker/useIpfsFilePicker'
import { twMerge } from 'tailwind-merge'

export const MessageSection = () => {
  const { projectName, projectPayDisclosure } = usePayProjectModal()
  const { values, setFieldValue, handleBlur } =
    useFormikContext<PayProjectModalFormValues>()
  return (
    <div>
      <span className="font-medium">
        <Trans>Message (optional)</Trans>
      </span>
      <div>
        <Input
          name="message"
          className="mt-1.5"
          placeholder="Attach an on-chain message to this payment"
          value={values.message}
          onChange={v => setFieldValue('message', v.target.value)}
          onBlur={handleBlur}
        />
      </div>
      {projectName && projectPayDisclosure && (
        <Callout
          collapsible
          className="mt-6 border border-bluebs-100 bg-bluebs-25 text-bluebs-700 dark:border-bluebs-800 dark:bg-bluebs-950 dark:text-bluebs-400"
          iconComponent={<EnvelopeIcon className="h-6 w-6" />}
        >
          <div>
            <div className="font-medium text-bluebs-700 dark:text-bluebs-300">
              <Trans>Message from {projectName}</Trans>
            </div>
            <p className="mt-2">{projectPayDisclosure}</p>
          </div>
        </Callout>
      )}
    </div>
  )
}

const Input: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = ({ className, ...props }) => {
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
        />
        <Tooltip title={t`Attach an image`}>
          <PhotoIcon
            role="button"
            className={twMerge(
              'h-6 w-6 text-bluebs-500',
              isUploading && 'animate-pulse',
            )}
            onClick={openFilePicker}
          />
          {FileInput}
        </Tooltip>
      </div>
      {isUploading && uploadProgress ? (
        <div>
          <div className="mt-2 flex items-center justify-between">
            <div className="h-1 flex-1">
              <div className="relative h-full w-full overflow-hidden rounded-lg bg-grey-200">
                <div
                  className="absolute top-0 left-0 h-full bg-bluebs-500"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <XCircleIcon
              className="ml-4 h-5 w-5 flex-none text-grey-400"
              role="button"
              onClick={cancelUpload}
            />
          </div>
        </div>
      ) : (
        uploadedUrl &&
        selectedFile && (
          <div className="mt-4 flex">
            <img
              className="h-12 w-12 rounded-md"
              src={uploadedUrl}
              alt={selectedFile.name}
            />
            <XCircleIcon
              className="ml-2 h-5 w-5 flex-none text-grey-400"
              role="button"
              onClick={removeFile}
            />

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
