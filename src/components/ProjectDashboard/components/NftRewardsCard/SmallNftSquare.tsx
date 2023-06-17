import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { NftRewardTier } from 'models/nftRewards'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'

// TODO: Rename to NftSquare or NftLogo or something
export const SmallNftSquare = ({
  nftReward,
  className,
  loading,
  border = false,
}: {
  nftReward: Pick<NftRewardTier, 'fileUrl' | 'name'> | undefined
  className?: string
  loading?: boolean
  border?: boolean
}) => {
  const _loading = !nftReward || loading
  const _className = twMerge(
    'rounded-lg bg-smoke-50',
    border && 'border-4 border-smoke-50 dark:border-slate-900',
    className,
  )

  if (_loading) {
    return <div className={`${_className}`}></div>
  }
  const fileUrl = useMemo(
    () => ipfsUriToGatewayUrl(nftReward.fileUrl),
    [nftReward.fileUrl],
  )

  return (
    <JuiceVideoThumbnailOrImage
      src={fileUrl}
      alt={nftReward.name}
      playIconPosition="hidden"
      containerClass={_className}
    />
  )
}
