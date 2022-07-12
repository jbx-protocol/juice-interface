import { Image, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { LoadingOutlined } from '@ant-design/icons'

import { NFTRewardTier } from 'models/v2/nftRewardTier'
import { useState } from 'react'

export function NftReward({
  nftReward,
}: {
  nftReward: NFTRewardTier
}): JSX.Element {
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  const nftImage = (
    <>
      {imageLoading ? (
        <LoadingOutlined size={25} style={{ marginLeft: 15 }} />
      ) : null}
      <div style={{ marginLeft: 15 }}>
        <Image
          src={nftReward.imageUrl}
          alt={nftReward.name}
          height={'50px'}
          style={{
            display: imageLoading ? 'none' : 'unset',
            objectFit: 'cover',
            width: '50px',
          }}
          onLoad={() => setImageLoading(false)}
        />
      </div>
    </>
  )
  const isLink = nftReward.externalLink

  const className = `text-primary ${
    isLink
      ? 'hover-text-action-primary hover-text-decoration-underline'
      : 'hover-color-unset'
  }`

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <ExternalLink
        style={{
          fontWeight: 500,
        }}
        className={className}
        href={isLink ? nftReward.externalLink : undefined}
      >
        {nftReward.name}
      </ExternalLink>
      {nftReward.description ? (
        <Tooltip title={nftReward.description}>{nftImage}</Tooltip>
      ) : (
        nftImage
      )}
    </div>
  )
}
