import { CloseCircleFilled } from '@ant-design/icons'
import { Button, Col, message, Row, Space, Upload } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useState } from 'react'
import { ipfsCidUrl, pinFileToIpfs } from 'utils/ipfs'

export default function ImageUploader({
  initialUrl,
  onSuccess,
  maxSize,
  metadata,
}: {
  initialUrl?: string
  metadata?: Record<string | number, any>
  onSuccess?: (url?: string) => void
  maxSize?: number // KB
}) {
  const [url, setUrl] = useState<string>()
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
      <Col xs={24} md={8}>
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
              <Button loading={loadingUpload}>Upload</Button>
            </Upload>
          )}
        </Space>
      </Col>

      <Col xs={24} md={16}>
        {url?.length ? (
          <Space
            style={{
              fontSize: '.7rem',
              wordBreak: 'break-all',
              textOverflow: 'ellipsis',
            }}
            direction="vertical"
          >
            <span>
              Uploaded to:{' '}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </span>
          </Space>
        ) : null}
      </Col>
    </Row>
  )
}
