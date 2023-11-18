import { CloseCircleFilled, UploadOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Progress, Upload, UploadProps } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { JuiceVideoPreview } from 'components/JuiceVideo/JuiceVideoPreview'
import Loading from 'components/Loading'
import { RewardImage } from 'components/NftRewards/RewardImage/RewardImage'
import { CreateButton } from 'components/buttons/CreateButton/CreateButton'
import { useContentType } from 'hooks/useContentType'
import { FormItemInput } from 'models/formItemInput'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { ReactNode, useCallback, useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { percentFromUploadProgressEvent } from 'utils/ipfs'
import { fileTypeIsVideo } from 'utils/nftRewards'
import { emitErrorNotification } from 'utils/notifications'

export type NftFileType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/x-m4v'
  | 'video/webm'

interface UploadNoStyleProps
  extends FormItemInput<string | undefined>,
    Omit<
      UploadProps,
      'onChange' | 'showUploadList' | 'children' | 'customRequest'
    > {
  sizeLimitMB?: number
  supportedFileTypes?: Set<NftFileType>
  customRequest?: (options: UploadRequestOption) => Promise<string> | string
  children?: (props: {
    percent: number | undefined
    isUploading: boolean
    uploadUrl: string | undefined
    undo: VoidFunction
  }) => ReactNode
}

export const UploadNoStyle = ({ value, ...props }: UploadNoStyleProps) => {
  const [_uploadUrl, _setUploadUrl] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [percent, setPercent] = useState<number | undefined>(undefined)

  const uploadUrl = value ?? _uploadUrl
  const setUploadUrl = props.onChange ?? _setUploadUrl

  const undo = useCallback(() => setUploadUrl(undefined), [setUploadUrl])

  const { data: contentType } = useContentType(uploadUrl)
  const isVideo = fileTypeIsVideo(contentType)

  const handleBeforeUpload = useCallback(
    async (file: RcFile) => {
      const fileIsAllowed = props.supportedFileTypes?.size
        ? ([...props.supportedFileTypes] as string[]).includes(file.type)
        : true
      const isInSizeLimit = props.sizeLimitMB
        ? file.size / 1024 / 1024 < props.sizeLimitMB
        : true

      if (!isInSizeLimit) {
        emitErrorNotification(
          t`File must be less than ${props.sizeLimitMB ?? '??'}MB`,
        )
      }
      if (!fileIsAllowed) {
        emitErrorNotification(
          t`File must be in a format of ${[
            ...(props.supportedFileTypes ?? []),
          ].join(', ')}`,
        )
      }

      const childCheck = await props.beforeUpload?.(file, [])

      return isInSizeLimit && fileIsAllowed && childCheck
    },
    [props],
  )

  const onCustomRequest = useCallback(
    async (req: UploadRequestOption) => {
      if (!props.customRequest) return
      setIsUploading(true)
      setPercent(0)

      try {
        const val = await props.customRequest({
          ...req,
          onProgress: e => {
            req.onProgress?.(e)
            if (e) {
              setPercent(percentFromUploadProgressEvent(e))
            }
          },
        })
        setUploadUrl(val)
      } catch (e) {
        console.error('Error occurred while uploading', e)
      } finally {
        setIsUploading(false)
      }
    },
    [props, setUploadUrl],
  )

  const _loadState =
    percent === 100 ? ( // now waiting on IPFS
      <div>
        <Loading />
        <div className="mt-2">
          <Trans>Awaiting IPFS response. This may take a while.</Trans>
        </div>
      </div>
    ) : (
      <div className="margin-auto">
        <Progress
          width={48}
          strokeColor="#748EED" // bluebs-400
          type="circle"
          percent={percent}
          format={percent => (
            <div className="text-black dark:text-grey-200">{percent ?? 0}%</div>
          )}
        />
      </div>
    )

  const _body = isUploading ? (
    _loadState
  ) : uploadUrl === undefined ? (
    <UploadButton />
  ) : isVideo ? (
    <JuiceVideoPreview src={uploadUrl} widthClass="w-full" />
  ) : (
    <UploadedImage imageUrl={uploadUrl} onRemoveImageClicked={undo} />
  )

  return (
    <Upload
      {...props}
      className="w-full"
      onChange={undefined}
      beforeUpload={handleBeforeUpload}
      customRequest={onCustomRequest}
      showUploadList={false}
    >
      {_body}
    </Upload>
  )
}

const UploadButton = () => {
  return (
    <CreateButton icon={<UploadOutlined />} className="h-[104px] w-full">
      Upload
    </CreateButton>
  )
}

const UploadedImage = ({
  imageUrl,
  onRemoveImageClicked,
}: {
  imageUrl: string
  onRemoveImageClicked?: VoidFunction
}) => {
  return (
    <div className="flex justify-center bg-smoke-200 py-2 dark:bg-slate-600">
      <div className="relative">
        <RewardImage
          alt="Uploaded NFT media"
          className="h-[11.5rem] w-[11.5rem]"
          src={imageUrl}
        />
        <CloseCircleFilled
          className="absolute top-0 right-0 cursor-pointer text-2xl text-bluebs-500"
          // TODO: We require @tailwind base to do this in className, so use style for now
          style={{ transform: 'translate(50%, -50%)' }}
          onClick={stopPropagation(onRemoveImageClicked)}
        />
      </div>
    </div>
  )
}
