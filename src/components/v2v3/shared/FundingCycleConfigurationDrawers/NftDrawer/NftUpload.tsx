import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Image, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import TooltipLabel from 'components/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { pinFileToIpfs } from 'lib/api/ipfs'
import { CSSProperties, useContext, useState } from 'react'
import { restrictedIpfsUrl } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

// Always showing images as squares
export const NFT_IMAGE_SIDE_LENGTH = '90px'

export default function NftUpload({ form }: { form: FormInstance }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [uploading, setUploading] = useState<boolean>()
  const [imageRenderLoading, setImageRenderLoading] = useState<boolean>()

  const setValue = (cid?: string) => {
    const newUrl = cid ? restrictedIpfsUrl(cid) : undefined
    form.setFieldsValue({ imageUrl: newUrl })
    setImageRenderLoading(true)
    setUploading(false)
  }

  // check file type and size
  const beforeUpload = (file: RcFile) => {
    const fileIsAllowed = ALLOWED_FILE_TYPES.includes(file.type)
    const isLt50000M = file.size / 1024 / 1024 < 50000

    if (!isLt50000M) {
      emitErrorNotification('File must be less than 50000MB')
    }
    if (!fileIsAllowed) {
      emitErrorNotification('File must be a JPG, PNG or GIF')
    }

    return fileIsAllowed && isLt50000M
  }

  const iconStyle: CSSProperties = {
    fontSize: '20px',
    color: colors.text.action.primary,
  }

  const imageUrl = form.getFieldValue('imageUrl')

  const validateImageUrl = () => {
    if (uploading) {
      return Promise.reject('File uploading.')
    } else if (imageUrl === undefined) {
      return Promise.reject('Image file required.')
    }
    return Promise.resolve()
  }

  const uploadButton = (
    <div>
      {uploading ? (
        <LoadingOutlined style={iconStyle} />
      ) : (
        <UploadOutlined style={iconStyle} />
      )}
      <div
        style={{
          marginTop: 8,
          width: '100%',
        }}
      >
        <div style={{ fontSize: 14 }}>
          <strong>
            <Trans>Upload an image</Trans>
          </strong>
        </div>
        <div style={{ color: colors.text.secondary, fontSize: 12 }}>
          JPG, PNG, GIF
        </div>
      </div>
    </div>
  )

  return (
    <Form.Item
      name={'NFT'}
      label={
        <TooltipLabel
          label={t`Image file`}
          tip={t`Attach the image to be associated with this NFT.`}
        />
      }
      rules={[{ required: true, validator: validateImageUrl }]}
      extra={t`Image will be cropped to a square in thumbnail previews on the Juicebox app.`}
      validateTrigger={'onSubmit'}
    >
      <Upload
        name="NFT"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={async req => {
          setUploading(true)
          const res = await pinFileToIpfs(req.file)
          setValue(res.IpfsHash)
        }}
        style={{ height: 'unset' }}
      >
        {imageUrl ? (
          <>
            {imageRenderLoading ? (
              <LoadingOutlined
                style={{ fontSize: '30px', color: colors.text.action.primary }}
              />
            ) : null}
            <Image
              src={imageUrl}
              alt={form.getFieldValue('name') ?? 'New NFT reward'}
              style={{
                display: imageRenderLoading ? 'none' : 'unset',
                width: NFT_IMAGE_SIDE_LENGTH,
                height: NFT_IMAGE_SIDE_LENGTH,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              onLoad={() => setImageRenderLoading(false)}
              onClick={e => e.stopPropagation()}
            />
          </>
        ) : (
          uploadButton
        )}
      </Upload>
    </Form.Item>
  )
}
