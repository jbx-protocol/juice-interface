import { LoadingOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import { NftRewardTier } from 'models/nftRewardTier'
import { useState } from 'react'
import { ipfsToHttps } from 'utils/ipfs'

// Appears in the 'NFTs for you' row of table in the confirm pay modal
export function NftRewardImagePreview({
  rewardTier,
}: {
  rewardTier: NftRewardTier
}) {
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  return (
    <div style={{ marginLeft: 15, display: 'flex', alignItems: 'center' }}>
      {imageLoading ? <LoadingOutlined style={{ fontSize: '20px' }} /> : null}
      <Image
        src={ipfsToHttps(rewardTier.imageUrl)}
        alt={rewardTier.name}
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
}
