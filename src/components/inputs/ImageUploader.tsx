import { CloseCircleFilled, FileImageOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Col, message, Row, Space, Upload } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useState } from 'react'
import { ipfsCidUrl, pinFileToIpfs } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'

import ExternalLink from '../ExternalLink'

enum ByteUnit {
  KB = 'KB',
  MB = 'MB',
}

export default function ImageUploader({
  initialUrl,
  onSuccess,
  maxSizeKBs: maxSize,
  metadata,
  text,
}: {
  initialUrl?: string
  metadata?: Record<string | number, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  onSuccess?: (url?: string) => void
  maxSizeKBs?: number // KB
  text?: string
}) {
  const [url, setUrl] = useState<string | undefined>(initialUrl)
  const [loadingUpload, setLoadingUpload] = useState<boolean>()

  const { theme } = useContext(ThemeContext)

  const setValue = (cid?: string) => {
    const newUrl = cid ? ipfsCidUrl(cid) : undefined
    setUrl(newUrl)
    onSuccess && onSuccess(newUrl)
  }

  useLayoutEffect(() => setUrl(initialUrl), [initialUrl])

  return (
    <Row
      style={{
        color: theme.colors.text.secondary,
      }}
      gutter={30}
    >
      <Col xs={24} md={7}>
        <Space align="start">
          {url && (
            <img
              style={{
                maxHeight: 80,
                maxWidth: 120,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: theme.radii.md,
              }}
              src={url}
              alt="Uploaded user content"
            />
          )}

          {url ? (
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
                try {
                  const res = await pinFileToIpfs(req.file, metadata)
                  setValue(res.IpfsHash)
                } catch (err) {
                  emitErrorNotification(t`Error uploading file`)
                }
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
        {url?.length ? (
          <span
            style={{
              fontSize: '.7rem',
              wordBreak: 'break-all',
              textOverflow: 'ellipsis',
            }}
          >
            <Trans>
              Uploaded to: <ExternalLink href={url}>{url}</ExternalLink>
            </Trans>
          </span>
        ) : null}
      </Col>
    </Row>
  )
}
