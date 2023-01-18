import { CloseCircleFilled, FileImageOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Col, message, Row, Space, Upload } from 'antd'
import { usePinFileToIpfs } from 'hooks/PinFileToIpfs'
import { useWallet } from 'hooks/Wallet'
import { useState } from 'react'
import { cidFromIpfsUri, ipfsUrl, openIpfsUrl } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'

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
  text,
}: {
  value?: string // IPFS link: `ipfs://${cid}`
  onChange?: (value?: string) => void
  maxSizeKBs?: number
  text?: string
}) => {
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
  const [imageCid, setImageCid] = useState<string | undefined>(
    value ? cidFromIpfsUri(value) : undefined,
  )

  const wallet = useWallet()
  const pinFileToIpfs = usePinFileToIpfs()

  const setValue = (cid?: string) => {
    setImageCid(cid)
    // storing images in `ipfs://` format where possible (see issue #1726)
    const url = cid ? ipfsUrl(cid) : undefined
    onChange?.(url)
  }

  const imageUrl = imageCid ? openIpfsUrl(imageCid) : undefined

  return (
    <Row className="text-grey-500 dark:text-grey-300" gutter={30}>
      <Col xs={24} md={7}>
        <Space align="start">
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
                let walletConnected = wallet.isConnected
                if (!walletConnected) {
                  const connectStates = await wallet.connect()
                  walletConnected = connectStates.length > 0
                }
                if (!walletConnected) return Upload.LIST_IGNORE
              }}
              customRequest={async req => {
                setLoadingUpload(true)
                try {
                  const res = await pinFileToIpfs({
                    ...req,
                    onProgress: percent => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      req.onProgress?.({ percent } as any)
                    },
                  })
                  setValue(res.IpfsHash)
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
        </Space>
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
