import { CloseCircleFilled, FileImageOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { PinataMetadata } from '@pinata/sdk'
import { Button, Col, message, Row, Space, Upload } from 'antd'
import { usePinFileToIpfs } from 'hooks/PinFileToIpfs'
import { useLayoutEffect, useState } from 'react'
import { ipfsToHttps, isIpfsUrl, restrictedIpfsUrl } from 'utils/ipfs'
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
  metadata?: PinataMetadata
  onSuccess?: (url?: string) => void
  maxSizeKBs?: number // KB
  text?: string
}) {
  const [url, setUrl] = useState<string | undefined>(initialUrl)
  const [loadingUpload, setLoadingUpload] = useState<boolean>()

  const pinFileToIpfs = usePinFileToIpfs()

  const setValue = (cid?: string) => {
    const newUrl = cid ? restrictedIpfsUrl(cid) : undefined
    setUrl(newUrl)
    onSuccess && onSuccess(newUrl)
  }

  useLayoutEffect(() => setUrl(initialUrl), [initialUrl])

  const _url = url && isIpfsUrl(url) ? ipfsToHttps(url) : url

  return (
    <Row className="text-grey-500 dark:text-grey-300" gutter={30}>
      <Col xs={24} md={7}>
        <Space align="start">
          {url && (
            <img
              className="max-h-[80px] max-w-[120px] rounded-sm object-cover object-center"
              src={_url}
              alt="Uploaded user content"
              crossOrigin="anonymous"
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
                  const res = await pinFileToIpfs({
                    ...req,
                    metadata,
                    onProgress: percent => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      req.onProgress?.({ percent } as any)
                    },
                  })
                  setValue(res.IpfsHash)
                } catch (err) {
                  emitErrorNotification(t`Error uploading file`)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  req.onError?.(null as any)
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
          <span className="text-ellipsis break-all text-xs">
            <Trans>
              Uploaded to: <ExternalLink href={url}>{url}</ExternalLink>
            </Trans>
          </span>
        ) : null}
      </Col>
    </Row>
  )
}
