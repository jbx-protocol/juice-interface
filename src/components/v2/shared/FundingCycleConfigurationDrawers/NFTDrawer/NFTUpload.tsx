import { t, Trans } from '@lingui/macro'
import { Form, Upload } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/lib/upload'
import TooltipLabel from 'components/shared/TooltipLabel'
import { CSSProperties, useContext, useState } from 'react'

import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'

type NFTFile = string | ArrayBuffer | null

const getBase64 = (img: Blob, callback: (result: NFTFile) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default function NFTUpload() {
  // @tank TODO: Will need to pass form object in to save the NFT URL with form.setFieldsValue({NFT, <url>})
  //   {
  //   form
  // }: {
  //   form: FormInstance
  // }
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [loading, setLoading] = useState<boolean>()
  const [imageUrl, setImageUrl] = useState<string>()

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    if (info.file.status === 'done' && info.file.originFileObj) {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, url => {
        setLoading(false)
        setImageUrl(url as string)
      })
    }
  }

  const beforeUpload = (file: RcFile) => {
    // check file type @tank
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'

    // limit file size ?? @tank says 5000mb
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isLt2M) {
      //message.error('Image must smaller than 2MB!');
    }

    return isJpgOrPng && isLt2M
  }

  const iconStyle: CSSProperties = {
    fontSize: '20px',
    color: colors.text.action.primary,
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
      rules={[{ required: true }]}
    >
      <Upload
        name="NFT"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </Form.Item>
  )
}
