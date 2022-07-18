import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Image, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import TooltipLabel from 'components/TooltipLabel'
import { CSSProperties, useContext, useState } from 'react'

import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { emitErrorNotification } from 'utils/notifications'
import { ipfsCidUrl, pinFileToIpfs } from 'utils/ipfs'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

export default function NftUpload({ form }: { form: FormInstance }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [uploading, setUploading] = useState<boolean>()
  const [imageRenderLoading, setImageRenderLoading] = useState<boolean>()

  const setValue = (cid?: string) => {
    const newUrl = cid ? ipfsCidUrl(cid) : undefined
    form.setFieldsValue({ imageUrl: newUrl })
    setImageRenderLoading(true)
    setUploading(false)
  }

  // check file type and size
  const beforeUpload = (file: RcFile) => {
    const fileIsAllowed = ALLOWED_FILE_TYPES.includes(file.type)
    const isLt5000M = file.size / 1024 / 1024 < 5000

    if (!isLt5000M) {
      emitErrorNotification('File must be less than 5000MB')
    }
    if (!fileIsAllowed) {
      emitErrorNotification('File must be a JPG, PNG or GIF')
    }

    return fileIsAllowed && isLt5000M
  }

  const iconStyle: CSSProperties = {
    fontSize: '20px',
    color: colors.text.action.primary,
  }

  const imageUrl = form.getFieldValue('imageUrl')

  const validateImageUrl = () => {
    if (imageUrl === undefined) {
      return Promise.reject()
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
                height: '100%',
                maxWidth: '90px',
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
