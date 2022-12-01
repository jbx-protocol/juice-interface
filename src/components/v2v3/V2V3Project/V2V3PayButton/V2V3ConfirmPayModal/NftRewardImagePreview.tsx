import { LoadingOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import { NftRewardTier } from 'models/nftRewardTier'
import { useState } from 'react'
import { classNames } from 'utils/classNames'
import { ipfsToHttps } from 'utils/ipfs'

// Appears in the 'NFTs for you' row of table in the confirm pay modal
export function NftRewardImagePreview({
  rewardTier,
}: {
  rewardTier: NftRewardTier
}) {
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  return (
    <div className="ml-4 flex items-center">
      {imageLoading ? <LoadingOutlined className="text-xl" /> : null}
      <Image
        className={classNames(
          'w-12 object-cover',
          imageLoading ? 'hidden' : '',
        )}
        src={ipfsToHttps(rewardTier.imageUrl)}
        alt={rewardTier.name}
        height={'50px'}
        onLoad={() => setImageLoading(false)}
        onClick={e => e.stopPropagation()}
        crossOrigin="anonymous"
      />
    </div>
  )
}
