import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { NftRewardTier } from 'models/nftRewards'
import { twMerge } from 'tailwind-merge'

export const SmallNftSquare = ({
  nftReward,
  className,
  loading,
}: {
  nftReward: NftRewardTier | undefined
  className?: string
  loading?: boolean
}) => {
  const _loading = !nftReward || loading
  const _className = twMerge(
    'rounded-lg border-4 border-smoke-50 bg-grey-400',
    className,
  )

  if (_loading) {
    return <div className={`${_className}`}></div>
  }
  return (
    <JuiceVideoThumbnailOrImage
      src={nftReward.fileUrl}
      alt={nftReward.name}
      playIconPosition="hidden"
      heightClass="h-14"
      widthClass="w-14"
      containerClass={_className}
    />
  )
}
