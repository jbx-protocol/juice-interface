import { t, Trans } from '@lingui/macro'
import { Form, FormInstance, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import TooltipLabel from 'components/shared/TooltipLabel'
import { CSSProperties, useContext, useState } from 'react'

import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { emitErrorNotification } from 'utils/notifications'
import { ipfsCidUrl, pinFileToIpfs } from 'utils/ipfs'

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg',
  'video/mp4',
  'video/webm',
]

export default function NFTUpload({ form }: { form: FormInstance }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [loading, setLoading] = useState<boolean>()

  const setValue = (cid?: string) => {
    const newUrl = cid ? ipfsCidUrl(cid) : undefined
    form.setFieldsValue({ imageUrl: newUrl })
    setLoading(false)
  }

  // check file type and size
  const beforeUpload = (file: RcFile) => {
    const fileIsAllowed = ALLOWED_FILE_TYPES.includes(file.type)
    const isLt5000M = file.size / 1024 / 1024 < 5000

    if (!isLt5000M) {
      emitErrorNotification('File must be less than 5000MB')
    }
    if (!fileIsAllowed) {
      emitErrorNotification('File must be a JPG, PNG, GIF, SVG, MP4 or WEBM.')
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
      {loading ? (
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
            <Trans>Upload an image or video</Trans>
          </strong>
        </div>
        <div style={{ color: colors.text.tertiary, fontSize: 12 }}>
          JPG, PNG, GIF, SVG, MP4, WEBM
        </div>
      </div>
    </div>
  )

  return (
    <Form.Item
      name={'NFT'}
      label={
        <TooltipLabel
          label={t`NFT`}
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
          setLoading(true)
          const res = await pinFileToIpfs(req.file)
          setValue(res.IpfsHash)
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={form.getFieldValue('name') ?? 'new NFT'}
            style={{
              height: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </Form.Item>
  )
}
