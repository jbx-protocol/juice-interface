import { CloseCircleFilled, FileImageOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { PinataMetadata } from '@pinata/sdk'
import { Button, Col, message, Row, Space, Upload } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { pinFileToIpfs } from 'lib/api/ipfs'
import { useContext, useState } from 'react'
import { cidFromIpfsUri, ipfsUrl, restrictedIpfsUrl } from 'utils/ipfs'

import ExternalLink from '../ExternalLink'

enum ByteUnit {
  KB = 'KB',
  MB = 'MB',
}

// TODO: This is a double up of `ImageUploader`. We should combine the two.

export const FormImageUploader = ({
  value,
  onChange,
  maxSizeKBs: maxSize,
  metadata,
  text,
}: {
  value?: string // IPFS link: `ipfs://${cid}`
  onChange?: (value?: string) => void
  metadata?: PinataMetadata
  maxSizeKBs?: number
  text?: string
}) => {
  const { theme } = useContext(ThemeContext)

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
  const [imageCid, setImageCid] = useState<string | undefined>(
    value ? cidFromIpfsUri(value) : undefined,
  )

  const setValue = (cid?: string) => {
    setImageCid(cid)
    // storing images in `ipfs://` format where possible (see issue #1726)
    const url = cid ? ipfsUrl(cid) : undefined
    onChange?.(url)
  }

  const imageUrl = imageCid ? restrictedIpfsUrl(imageCid) : undefined

  return (
    <Row
      style={{
        color: theme.colors.text.secondary,
      }}
      gutter={30}
    >
      <Col xs={24} md={7}>
        <Space align="start">
          {imageUrl ? (
            <img
              style={{
                maxHeight: 80,
                maxWidth: 120,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: theme.radii.md,
              }}
              src={imageUrl}
              alt="Uploaded user content"
              crossOrigin="anonymous"
            />
          ) : null}

          {imageUrl ? (
            <Button
              icon={<CloseCircleFilled />}
              type="text"
              onClick={() => setValue()}
            />
          ) : (
            <Upload
              accept="image/png, image/jpeg, image/jpg, image/gif"
              beforeUpload={file => {
                if (maxSize !== undefined && file.size > maxSize * 1000) {
                  const unit = maxSize > 999 ? ByteUnit.MB : ByteUnit.KB
                  const formattedSize =
                    unit === ByteUnit.MB
                      ? (maxSize / 1000.0).toFixed(1)
                      : maxSize.toString()
                  message.error(
                    t`File must be less than ${formattedSize}${unit}`,
                  )
                  return Upload.LIST_IGNORE
                }
              }}
              customRequest={async req => {
                setLoadingUpload(true)
                const res = await pinFileToIpfs(req.file, metadata)
                setValue(res.IpfsHash)
                setLoadingUpload(false)
              }}
            >
              <Button loading={loadingUpload} type="dashed">
                <FileImageOutlined /> {text ?? null}
              </Button>
            </Upload>
          )}
        </Space>
      </Col>

      <Col xs={24} md={17}>
        {imageUrl ? (
          <span
            style={{
              fontSize: '0.75rem',
              wordBreak: 'break-all',
              textOverflow: 'ellipsis',
            }}
          >
            <Trans>
              Uploaded to:{' '}
              <ExternalLink href={imageUrl}>{imageUrl}</ExternalLink>
            </Trans>
          </span>
        ) : null}
      </Col>
    </Row>
  )
}
