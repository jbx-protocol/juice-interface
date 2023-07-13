import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import axios from 'axios'
import ExternalLink from 'components/ExternalLink'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import Loading from 'components/Loading'
import { useProjectMetadata } from 'components/ProjectDashboard/hooks'
import { JuiceModal } from 'components/modals/JuiceModal'
import { PV_V2 } from 'constants/pv'
import { Formik } from 'formik'
import { useIpfsFilePicker } from 'hooks/useIpfsFilePicker/useIpfsFilePicker'
import { twMerge } from 'tailwind-merge'
import { getSubgraphIdForProject } from 'utils/graph'
import * as Yup from 'yup'

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').max(100, 'Too long'),
  message: Yup.string().required('Message is required').max(3000, 'Too long'),
  imageUrl: Yup.string().url('Invalid URL'),
})
type AddProjectUpdateFormValues = Yup.InferType<typeof ValidationSchema>

export const AddProjectUpdateModal = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { projectId } = useProjectMetadata()
  const project = projectId
    ? getSubgraphIdForProject(PV_V2, projectId)
    : undefined

  if (!project) return <Loading />

  return (
    <Formik<AddProjectUpdateFormValues>
      validationSchema={ValidationSchema}
      initialValues={{
        title: '',
        message: '',
      }}
      onSubmit={async (values, helper) => {
        const { title, message, imageUrl } = values
        await axios.post(`/api/projects/${project}/updates`, {
          title,
          message,
          imageUrl,
        })
        setOpen(false)
        setTimeout(() => {
          helper.setSubmitting(false)
          helper.resetForm()
        }, 300)
      }}
    >
      {props => (
        <form name="NewUpdateModalForm" onSubmit={props.handleSubmit}>
          <JuiceModal
            className="w-full max-w-xl"
            buttonPosition="stretch"
            title={t`Add project update`}
            position="top"
            okLoading={props.isSubmitting}
            okButtonForm="NewUpdateModalForm"
            okText={t`Add update`}
            onSubmit={props.handleSubmit}
            open={open}
            setOpen={setOpen}
            onCancel={setOpen => {
              setOpen(false)
            }}
          >
            <span>
              <Trans>
                Add an update that will be posted to your project page.
              </Trans>
            </span>
            <div className="mt-8 flex flex-col gap-6">
              <div>
                <label htmlFor="title" className="font-medium text-grey-700">
                  <Trans>Title</Trans>
                </label>
                <div
                  className={twMerge(
                    'mt-1.5 flex items-center justify-between rounded-lg border border-grey-300 px-3 py-2 shadow-sm dark:border-slate-600',
                  )}
                >
                  <input
                    id="title"
                    {...props}
                    className={twMerge(
                      'flex-1 bg-transparent outline-none dark:placeholder:text-slate-300',
                    )}
                    value={props.values.title}
                    onChange={e =>
                      props.setFieldValue('title', e.currentTarget.value)
                    }
                  />
                </div>
                <div>
                  {props.errors.title && props.touched.title && (
                    <div className="mt-1 text-sm text-error-500">
                      {props.errors.title}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="font-medium text-grey-700">
                  <Trans>Message</Trans>
                </label>
                <div
                  className={twMerge(
                    'mt-1.5 flex items-center justify-between rounded-lg border border-grey-300 px-3 py-2 shadow-sm dark:border-slate-600',
                  )}
                >
                  <textarea
                    id="message"
                    className={twMerge(
                      'flex-1 bg-transparent outline-none dark:placeholder:text-slate-300',
                    )}
                    value={props.values.message}
                    onChange={e =>
                      props.setFieldValue('message', e.currentTarget.value)
                    }
                    rows={4}
                    maxLength={3000}
                  />
                </div>
                <div>
                  {props.errors.message && props.touched.message && (
                    <div className="mt-1 text-sm text-error-500">
                      {props.errors.message}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <UploadImage
                  onChange={url => props.setFieldValue('imageUrl', url)}
                />
                {!props.values.imageUrl && (
                  <div className="mt-2.5 text-xs text-grey-400 dark:text-slate-200">
                    <Trans>
                      A horizontal banner image sized 288 x 556 is recommended.
                    </Trans>
                  </div>
                )}
                <div>
                  {props.errors.imageUrl && props.touched.imageUrl && (
                    <div className="mt-1 text-sm text-error-500">
                      {props.errors.imageUrl}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </JuiceModal>
        </form>
      )}
    </Formik>
  )
}

const UploadImage = ({
  onChange,
}: {
  onChange: (value: string | undefined) => void
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
    onFileUrlChange: url => onChange(url),
  })

  return (
    <>
      {FileInput}
      {isUploading ? (
        <div>
          <div className="flex items-center justify-between">
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
      ) : uploadedUrl && selectedFile ? (
        <div className="flex">
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
      ) : (
        <Button
          className="flex w-fit items-center gap-2"
          type="dashed"
          icon={<PhotoIcon className="h-5 w-5" />}
          onClick={openFilePicker}
        >
          <Trans>Add banner image</Trans>
        </Button>
      )}
    </>
  )
}
