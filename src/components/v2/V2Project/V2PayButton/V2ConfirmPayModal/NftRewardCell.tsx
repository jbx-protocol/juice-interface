import { Image, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { LoadingOutlined } from '@ant-design/icons'

import { NftRewardTier } from 'models/v2/nftRewardTier'
import { useState } from 'react'

export function NftRewardCell({
  nftReward,
}: {
  nftReward: NftRewardTier
}): JSX.Element {
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  const nftImage = (
    <div style={{ marginLeft: 15 }}>
      {imageLoading ? <LoadingOutlined style={{ fontSize: '20px' }} /> : null}
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
        onClick={e => e.stopPropagation()}
      />
    </div>
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
      <Tooltip
        title={nftReward.description}
        visible={nftReward.description ? undefined : false}
      >
        {nftImage}
      </Tooltip>
    </div>
  )
}
