import { CloseCircleFilled, FileImageOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button, Col, Row, Upload, message } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { pinFile } from 'lib/api/ipfs'
import { useState } from 'react'
import { cidFromIpfsUri, ipfsGatewayUrl, ipfsUri } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'

enum ByteUnit {
  KB = 'KB',
  MB = 'MB',
}

export const FormImageUploader = ({
  value,
  onChange,
  maxSizeKBs: maxSize,
  text,
}: {
  value?: string // IPFS link: `ipfs://${cid}`
  onChange?: (value?: string) => void
  maxSizeKBs?: number
  text?: string
}) => {
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
  const [_imageCid, _setImageCid] = useState<string | undefined>(
    value ? cidFromIpfsUri(value) : undefined,
  )

  const imageCid = value ? cidFromIpfsUri(value) : _imageCid

  const setValue = (cid?: string) => {
    _setImageCid(cid)
    // storing images in `ipfs://` format where possible (see issue #1726)
    const url = cid ? ipfsUri(cid) : undefined
    onChange?.(url)
  }

  const imageUrl = imageCid ? ipfsGatewayUrl(imageCid) : undefined

  return (
    <Row className="text-grey-500 dark:text-grey-300" gutter={30}>
      <Col xs={24} md={7}>
        <div className="flex gap-2">
          {imageUrl ? (
            <img
              className="max-h-[80px] max-w-[120px] rounded-sm object-cover object-center"
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
              beforeUpload={async file => {
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
                  const res = await pinFile(req.file)
                  setValue(res.Hash)
                } catch (e) {
                  emitErrorNotification(t`Error uploading file`)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  req.onError?.(null as any)
                } finally {
                  setLoadingUpload(false)
                }
              }}
            >
              <Button loading={loadingUpload} type="dashed">
                <FileImageOutlined /> {text ?? null}
              </Button>
            </Upload>
          )}
        </div>
      </Col>

      <Col xs={24} md={17}>
        {imageUrl ? (
          <span className="text-ellipsis break-all text-xs">
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
