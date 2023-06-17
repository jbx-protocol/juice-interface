import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { NftRewardTier } from 'models/nftRewards'
import { twMerge } from 'tailwind-merge'

export function NftThumbnail({
  fileUrl,
  isSelected,
  rewardTier,
}: {
  fileUrl: string | undefined
  isSelected: boolean
  rewardTier: NftRewardTier | undefined
}) {
  return (
    <div
      className={twMerge(
        'relative flex h-60 w-full items-center justify-center rounded-t-lg',
        isSelected
          ? 'bg-white dark:bg-slate-800'
          : 'bg-white dark:bg-slate-600',
      )}
    >
      {fileUrl ? (
        <JuiceVideoThumbnailOrImage
          src={fileUrl}
          alt={rewardTier?.name ?? 'Juicebox NFT reward'}
          containerClass="rounded-none"
          className="h-60 w-full rounded-t-lg"
        />
      ) : null}
    </div>
  )
}
