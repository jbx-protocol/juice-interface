import { CloseCircleFilled } from '@ant-design/icons'
import { FileImageOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, message, Row, Space, Upload } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useState } from 'react'
import { ipfsCidUrl, pinFileToIpfs } from 'utils/ipfs'

export default function ImageUploader({
  initialUrl,
  onSuccess,
  maxSize,
  metadata,
  text,
}: {
  initialUrl?: string
  metadata?: Record<string | number, any>
  onSuccess?: (url?: string) => void
  maxSize?: number // KB
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
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img
              style={{
                maxHeight: 80,
                maxWidth: 120,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: theme.radii.md,
              }}
              src={url}
              alt="Uploaded image"
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
                  message.error('File must be less than ' + maxSize + 'KB')
                  return Upload.LIST_IGNORE
                }
              }}
              customRequest={req =>
                pinFileToIpfs(req.file, {
                  metadata,
                  beforeUpload: () => setLoadingUpload(true),
                  onSuccess: cid => {
                    setValue(cid)
                    setLoadingUpload(false)
                  },
                }).then(res => {
                  if (res.success) {
                    req.onSuccess && req.onSuccess(req.data, res.res as any)
                  } else req.onError && req.onError(res.err as any, req.data)
                })
              }
            >
              <Button loading={loadingUpload} type="text">
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
              Uploaded to:{' '}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </Trans>
          </span>
        ) : null}
      </Col>
    </Row>
  )
}
