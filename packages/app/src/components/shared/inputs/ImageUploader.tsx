import { CloseCircleFilled } from '@ant-design/icons'
import { Button, Col, message, Row, Space, Upload } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'
import { uploadFile, ipfsCidUrl } from 'utils/ipfs'

export default function ImageUploader({
  initialPreview,
  onSuccess,
  maxSize,
  metadata,
}: {
  initialPreview?: string
  metadata?: Record<string | number, any>
  onSuccess?: (hash: string) => void
  maxSize?: number // KB
}) {
  const [ipfsHash, setIpfsHash] = useState<string>()
  const [loadingUpload, setLoadingUpload] = useState<boolean>()

  const { theme } = useContext(ThemeContext)

  const fileUrl = ipfsCidUrl(ipfsHash) || initialPreview

  return (
    <Row
      style={{
        color: theme.colors.text.secondary,
      }}
    >
      <Col xs={24} md={8}>
        <Space align="start">
          {fileUrl && (
            <img
              style={{
                maxHeight: 80,
                maxWidth: 120,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: theme.radii.md,
              }}
              src={fileUrl}
            />
          )}

          {ipfsHash ? (
            <Button
              icon={<CloseCircleFilled />}
              type="text"
              onClick={() => setIpfsHash(undefined)}
            ></Button>
          ) : (
            <Upload
              accept="image/png, image/jpeg, image/jpg, image/gif"
              beforeUpload={file => {
                console.log('before', file)
                if (maxSize !== undefined && file.size > maxSize * 1000) {
                  message.error('File must be less than ' + maxSize + 'KB')
                  return Upload.LIST_IGNORE
                }
              }}
              customRequest={req =>
                uploadFile(req.file, {
                  beforeUpload: () => setLoadingUpload(true),
                  onSuccess: cid => {
                    setLoadingUpload(false)
                    onSuccess && onSuccess(cid)
                    setIpfsHash(cid)
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
        {ipfsHash && (
          <Space
            style={{
              fontSize: '.7rem',
              wordBreak: 'break-all',
              textOverflow: 'ellipsis',
            }}
            direction="vertical"
          >
            <div>IPFS hash: {ipfsHash}</div>
            <span>
              Uploaded to:{' '}
              <a
                href={ipfsCidUrl(ipfsHash)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ipfsCidUrl(ipfsHash)}
              </a>
            </span>
          </Space>
        )}
      </Col>
    </Row>
  )
}
