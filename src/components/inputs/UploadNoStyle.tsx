import { CloseCircleFilled, UploadOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Progress, Upload, UploadProps } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { CreateButton } from 'components/buttons/CreateButton'
import { RewardImage } from 'components/Create/components/RewardImage'
import { MP4_FILE_TYPE } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/NftUpload'
import { JuiceVideoPreview } from 'components/v2v3/shared/NftVideo/JuiceVideoPreview'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContentType } from 'hooks/ContentType'
import { FormItemInput } from 'models/formItemInput'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { ReactNode, useCallback, useContext, useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { emitErrorNotification } from 'utils/notifications'

export type SupportedNftFileTypes =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'video/mp4'
interface UploadNoStyleProps
  extends FormItemInput<string | undefined>,
    Omit<
      UploadProps,
      'onChange' | 'showUploadList' | 'children' | 'customRequest'
    > {
  sizeLimit?: number
  supportedFileTypes?: Set<SupportedNftFileTypes>
  customRequest?: (options: UploadRequestOption) => Promise<string> | string
  children?: (props: {
    percent: number | undefined
    isUploading: boolean
    uploadUrl: string | undefined
    undo: VoidFunction
  }) => ReactNode
}

export const UploadNoStyle = (props: UploadNoStyleProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [_uploadUrl, _setUploadUrl] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [percent, setPercent] = useState<number | undefined>(undefined)

  const uploadUrl = props.value ?? _uploadUrl
  const setUploadUrl = props.onChange ?? _setUploadUrl

  const undo = useCallback(() => setUploadUrl(undefined), [setUploadUrl])

  const { data: contentType } = useContentType(uploadUrl)
  const isVideo = contentType === MP4_FILE_TYPE

  const handleBeforeUpload = useCallback(
    async (file: RcFile) => {
      const fileIsAllowed = props.supportedFileTypes?.size
        ? ([...props.supportedFileTypes] as string[]).includes(file.type)
        : true
      const isInSizeLimit = props.sizeLimit
        ? file.size / 1024 / 1024 < props.sizeLimit
        : true

      if (!isInSizeLimit) {
        emitErrorNotification(
          t`File must be less than ${props.sizeLimit ?? '??'}MB`,
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
              // Bit of a hack
              setPercent(e as unknown as number)
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

  const _body = isUploading ? (
    <div>
      <Progress
        width={48}
        className="h-8 w-8"
        strokeColor={colors.background.action.primary}
        type="circle"
        percent={percent}
        format={percent => (
          <div className="text-black dark:text-grey-200">{percent ?? 0}%</div>
        )}
      />
    </div>
  ) : uploadUrl === undefined ? (
    <UploadButton />
  ) : isVideo ? (
    <JuiceVideoPreview src={uploadUrl} />
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
    <CreateButton icon={<UploadOutlined />} className="h-24 w-full">
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
        <RewardImage className="h-[11.5rem] w-[11.5rem]" src={imageUrl} />
        <CloseCircleFilled
          className="absolute top-0 right-0 cursor-pointer text-2xl text-haze-400"
          // TODO: We require @tailwind base to do this in className, so use style for now
          style={{ transform: 'translate(50%, -50%)' }}
          onClick={stopPropagation(onRemoveImageClicked)}
        />
      </div>
    </div>
  )
}
