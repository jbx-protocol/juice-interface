import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Image, Progress, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import TooltipLabel from 'components/TooltipLabel'
import { VeNftFormFields } from 'components/veNft/VeNftRewardTierModal'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { MP4_FILE_TYPE } from 'constants/fileTypes'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useWallet } from 'hooks/Wallet'
import { pinFile } from 'lib/api/ipfs'
import { useContext, useState } from 'react'
import { classNames } from 'utils/classNames'
import { featureFlagEnabled } from 'utils/featureFlags'
import { ipfsGatewayUrl } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'
import { NftFormFields } from './NftRewardTierModal'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

// Always showing images as squares
export const NFT_IMAGE_SIDE_LENGTH = '90px'

export default function NftUpload({
  form,
}: {
  form: FormInstance<NftFormFields | VeNftFormFields>
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [uploading, setUploading] = useState<boolean>()
  const [imageRenderLoading, setImageRenderLoading] = useState<boolean>()
  const [percent, setPercent] = useState<number | undefined>(undefined)
  const wallet = useWallet()

  const setValue = (cid?: string) => {
    const newUrl = cid ? ipfsGatewayUrl(cid) : undefined
    form.setFieldsValue({ fileUrl: newUrl })
    setImageRenderLoading(true)
    setUploading(false)
  }

  const nftMp4Enabled = featureFlagEnabled(FEATURE_FLAGS.NFT_MP4)

  // check file type and size
  const beforeUpload = async (file: RcFile) => {
    const fileIsAllowed = [
      ...ALLOWED_FILE_TYPES,
      nftMp4Enabled ? MP4_FILE_TYPE : '',
    ].includes(file.type)

    const isLt50000M = file.size / 1024 / 1024 < 50000

    if (!isLt50000M) {
      emitErrorNotification('File must be less than 50000MB')
    }
    if (!fileIsAllowed) {
      emitErrorNotification('File must be a JPG, PNG, GIF or MP4')
    }

    let walletConnected = wallet.isConnected
    if (!wallet.isConnected) {
      const connectStates = await wallet.connect()
      walletConnected = connectStates.length > 0
    }

    return fileIsAllowed && isLt50000M && walletConnected
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
      extra={t`NFT will be cropped to a square in thumbnail previews on the Juicebox app.`}
      validateTrigger={'onSubmit'}
    >
      <Upload
        name="NFT"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={async req => {
          setUploading(true)
          setPercent(0)
          try {
            const val = await pinFile(req.file)
            setValue(val.IpfsHash)
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
          <>
            {imageRenderLoading ? (
              <LoadingOutlined className="text-3xl text-haze-400 dark:text-haze-300" />
            ) : null}
            <Image
              className={classNames(
                'h-24 w-24 object-cover object-center',
                imageRenderLoading ? 'hidden' : '',
              )}
              src={fileUrl}
              alt={form.getFieldValue('name') ?? 'New NFT reward'}
              onLoad={() => setImageRenderLoading(false)}
              onClick={e => e.stopPropagation()}
            />
          </>
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
                JPG, PNG, GIF{nftMp4Enabled ? ', MP4' : ''}
              </div>
            </div>
          </div>
        )}
      </Upload>
    </Form.Item>
  )
}
