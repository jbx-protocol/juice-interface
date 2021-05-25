import { CloseCircleFilled } from '@ant-design/icons'
import { Button, Col, Row, Space, Upload } from 'antd'
import Axios from 'axios'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'
import { urlForIpfsHash } from 'utils/ipfs'

export default function IpfsUploader({
  initialValue,
  onSuccess,
}: {
  initialValue?: string
  onSuccess: (hash: string) => void
}) {
  const [ipfsHash, setIpfsHash] = useState<string>()
  const [loadingUpload, setLoadingUpload] = useState<boolean>()

  const { theme } = useContext(ThemeContext)

  const uploadFile = async (file: File) => {
    setLoadingUpload(true)

    let data = new FormData()

    data.append('file', file)

    data.append(
      'pinataMetadata',
      JSON.stringify({
        keyvalues: {
          src: 'juiceProject',
        },
      }),
    )

    Axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data;`,
        pinata_api_key: process.env.REACT_APP_PINATA_PINNER_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_PINNER_SECRET,
      },
    })
      .then(res => {
        const hash = res.data.IpfsHash
        setIpfsHash(hash)
        onSuccess(hash)
        setLoadingUpload(false)
      })
      .catch(err => {
        console.log('err', err)
        setLoadingUpload(false)
      })
  }

  const fileUrl = initialValue || urlForIpfsHash(ipfsHash)

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
                uploadFile(file)
                return false
              }}
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
                href={urlForIpfsHash(ipfsHash)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {urlForIpfsHash(ipfsHash)}
              </a>
            </span>
          </Space>
        )}
      </Col>
    </Row>
    // <div
    //   style={{
    //     color: theme.colors.text.secondary,
    //   }}
    // >
    //   <Space direction="vertical">
    //     <Space align="start">
    //       {ipfsHash && (
    //         <img
    //           style={{
    //             maxHeight: 80,
    //             maxWidth: 120,
    //             objectFit: 'cover',
    //             objectPosition: 'center',
    //             borderRadius: theme.radii.md,
    //           }}
    //           src={urlForIpfsHash(ipfsHash)}
    //         />
    //       )}

    //       {ipfsHash ? (
    //         <Button
    //           icon={<CloseCircleFilled />}
    //           type="text"
    //           onClick={() => setIpfsHash(undefined)}
    //         ></Button>
    //       ) : (
    //         <Upload
    //           accept="image/png, image/jpeg, image/jpg, image/gif"
    //           beforeUpload={file => {
    //             uploadFile(file)
    //             return false
    //           }}
    //         >
    //           <Button loading={loadingUpload}>Upload</Button>
    //         </Upload>
    //       )}
    //     </Space>

    //     {ipfsHash && (
    //       <Space
    //         style={{
    //           fontSize: '.7rem',
    //           maxWidth: 300,
    //           wordBreak: 'break-all',
    //         }}
    //         direction="vertical"
    //       >
    //         <span>
    //           Uploaded to:{' '}
    //           <a
    //             href={urlForIpfsHash(ipfsHash)}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //           >
    //             {urlForIpfsHash(ipfsHash)}
    //           </a>
    //         </span>
    //         <div>IPFS hash: {ipfsHash}</div>
    //       </Space>
    //     )}
    //   </Space>
    // </div>
  )
}
