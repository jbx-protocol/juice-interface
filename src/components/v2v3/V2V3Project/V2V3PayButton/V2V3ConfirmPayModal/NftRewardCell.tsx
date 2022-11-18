import { LoadingOutlined } from '@ant-design/icons'
import { Image, Space, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'

import { NftRewardTier } from 'models/nftRewardTier'
import { useState } from 'react'
import { ipfsToHttps } from 'utils/ipfs'

export function NftRewardCell({
  nftRewards,
}: {
  nftRewards: NftRewardTier[]
}): JSX.Element {
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  const nftImage = (tier: NftRewardTier) => (
    <div style={{ marginLeft: 15, display: 'flex', alignItems: 'center' }}>
      {imageLoading ? <LoadingOutlined style={{ fontSize: '20px' }} /> : null}
      <Image
        src={ipfsToHttps(tier.imageUrl)}
        alt={tier.name}
        height={'50px'}
        style={{
          display: imageLoading ? 'none' : 'unset',
          objectFit: 'cover',
          width: '50px',
        }}
        onLoad={() => setImageLoading(false)}
        onClick={e => e.stopPropagation()}
        crossOrigin="anonymous"
      />
    </div>
  )

  return (
    <Space size={'middle'} direction={'vertical'} style={{ width: '100%' }}>
      {nftRewards.map((tier: NftRewardTier, idx) => {
        const isLink = tier.externalLink

        const className = `text-primary ${
          isLink
            ? 'hover-text-action-primary hover-text-decoration-underline'
            : 'hover-color-unset'
        }`

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <ExternalLink
              style={{
                fontWeight: 500,
                cursor: isLink ? 'pointer' : 'default',
              }}
              className={className}
              href={isLink ? tier.externalLink : undefined}
            >
              {tier.name}
            </ExternalLink>
            <Tooltip
              title={tier.description}
              open={tier.description ? undefined : false}
            >
              {nftImage(tier)}
            </Tooltip>
          </div>
        )
      })}
    </Space>
  )
}
