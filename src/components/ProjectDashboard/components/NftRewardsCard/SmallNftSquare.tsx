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
  const showLoadingState = !nftReward || loading

  if (showLoadingState) {
    return (
      <div
        className={twMerge(
          'rounded-lg bg-smoke-50',
          border &&
            'border-4 border-solid border-smoke-50 dark:border-slate-700',
          className,
        )}
      />
    )
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
      className={twMerge(
        'rounded-lg bg-smoke-50',
        border && 'border-4 border-solid border-smoke-50 dark:border-slate-700',
        className,
      )}
    />
  )
}
