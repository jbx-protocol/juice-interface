import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { NftRewardTier } from 'models/nftRewards'
import { twMerge } from 'tailwind-merge'

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
    'rounded-lg bg-grey-400',
    border && 'border-4 border-smoke-50 dark:border-slate-900',
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
      containerClass={_className}
    />
  )
}
