import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { NFTRewardTier } from 'models/v2/nftRewardTier'

export function NftReward({
  nftReward,
}: {
  nftReward: NFTRewardTier
}): JSX.Element {
  const nftImage = (
    <img
      src={nftReward.imageUrl}
      alt={nftReward.name}
      width={'50px'}
      height={'50px'}
      style={{
        marginLeft: 15,
      }}
    />
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
