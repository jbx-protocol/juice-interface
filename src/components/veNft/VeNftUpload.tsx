import { UploadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Progress, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { JuiceVideoThumbnailOrImage } from 'components/NftRewards/NftVideo/JuiceVideoThumbnailOrImage'
import TooltipLabel from 'components/TooltipLabel'
import { VeNftFormFields } from 'components/veNft/VeNftRewardTierModal'
import { VIDEO_FILE_TYPES } from 'constants/fileTypes'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { pinFile } from 'lib/api/ipfs'
import {
  UploadProgressEvent,
  UploadRequestOption,
} from 'rc-upload/lib/interface'
import { useContext, useState } from 'react'
import { ipfsGatewayUrl, percentFromUploadProgressEvent } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'].concat(
  VIDEO_FILE_TYPES,
)

export function VeNftUpload({ form }: { form: FormInstance<VeNftFormFields> }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [uploading, setUploading] = useState<boolean>()
  const [percent, setPercent] = useState<number | undefined>(undefined)

  const setValue = (cid?: string) => {
    const newUrl = cid ? ipfsGatewayUrl(cid) : undefined
    form.setFieldsValue({ fileUrl: newUrl })
    setUploading(false)
  }

  // check file type and size
  const beforeUpload = async (file: RcFile) => {
    const fileIsAllowed = ALLOWED_FILE_TYPES.includes(file.type)

    const isLt50000M = file.size / 1024 / 1024 < 50000

    if (!isLt50000M) {
      emitErrorNotification('File must be less than 50000MB')
    }
    if (!fileIsAllowed) {
      emitErrorNotification('File must be a JPG, PNG, GIF, MP4, MOV, WEBM, M4V')
    }

    return fileIsAllowed && isLt50000M
  }

  const fileUrl = form.getFieldValue('fileUrl')

  const validateFileUrl = () => {
    if (uploading) {
      return Promise.reject('File uploading.')
    } else if (fileUrl === undefined) {
      return Promise.reject('File required.')
    }
    return Promise.resolve()
  }

  const onProgress = (e: UploadProgressEvent) => {
    if (e) {
      setPercent(percentFromUploadProgressEvent(e))
    }
  }

  return (
    <Form.Item
      name={'NFT'}
      label={
        <TooltipLabel
          label={t`File`}
          tip={t`Attach the image/video to be associated with this NFT.`}
        />
      }
      rules={[{ required: true, validator: validateFileUrl }]}
      extra={t`Images will be cropped to a square in thumbnail previews on the Juicebox app.`}
      validateTrigger={'onSubmit'}
    >
      <Upload
        name="NFT"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={async (req: UploadRequestOption) => {
          setUploading(true)
          setPercent(0)
          const { file } = req
          try {
            const val = await pinFile(file, onProgress)
            setValue(val.Hash)
          } catch (e) {
            console.error('Error occurred while uploading', e)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            req.onError?.(null as any)
          } finally {
            setUploading(false)
          }
        }}
      >
        {fileUrl ? (
          <JuiceVideoThumbnailOrImage
            src={fileUrl}
            alt={form.getFieldValue('name') ?? 'New NFT reward'}
            heightClass="h-24"
            widthClass="w-24"
            showPreviewOnClick
          />
        ) : (
          <div>
            {uploading ? (
              <Progress
                width={48}
                className="mb-2 h-8 w-8"
                strokeColor={colors.background.action.primary}
                type="circle"
                percent={percent}
                format={percent => (
                  <div className="text-black dark:text-grey-200">
                    {percent ?? 0}%
                  </div>
                )}
              />
            ) : (
              <UploadOutlined className="text-xl text-haze-400 dark:text-haze-300" />
            )}
            <div className="mt-2 w-full">
              <div className="text-sm">
                <strong>
                  <Trans>Upload a file</Trans>
                </strong>
              </div>
              <div className="text-xs text-grey-500 dark:text-grey-300">
                JPG, PNG, GIF, MP4, MOV, WEBM, M4V
              </div>
            </div>
          </div>
        )}
      </Upload>
    </Form.Item>
  )
}
