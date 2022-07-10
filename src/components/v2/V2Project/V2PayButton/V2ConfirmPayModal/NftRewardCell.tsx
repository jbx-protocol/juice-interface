import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Loading from 'components/Loading'
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
      {imageLoading ? <Loading size={25} style={{ marginLeft: 15 }} /> : null}
      <img
        src={nftReward.imageUrl}
        alt={nftReward.name}
        height={'50px'}
        style={{
          marginLeft: 15,
          display: imageLoading ? 'none' : 'unset',
          objectFit: 'cover',
          width: '50px',
        }}
        onLoad={() => setImageLoading(false)}
      />
    </>
  )
  const isLink = nftReward.externalLink.length

  const className = `text-primary ${
    isLink
      ? 'hover-text-action-primary hover-text-decoration-underline'
      : 'hover-unset'
  }`

  return (
    <ExternalLink
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        cursor: isLink ? 'pointer' : 'default',
      }}
      className={className}
      href={isLink ? nftReward.externalLink : undefined}
    >
      <span
        style={{
          fontWeight: 500,
        }}
      >
        {nftReward.name}
      </span>
      {nftReward.description.length ? (
        <Tooltip title={nftReward.description}>{nftImage}</Tooltip>
      ) : (
        nftImage
      )}
    </ExternalLink>
  )
}
