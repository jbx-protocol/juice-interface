import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { NftRewardTier } from 'models/nftRewards'
import { classNames } from 'utils/classNames'

const NFT_DISPLAY_HEIGHT_CLASS = 'h-36' // rem height

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
      className={classNames(
        `relative flex w-full items-center justify-center rounded-t-lg ${NFT_DISPLAY_HEIGHT_CLASS}`,
        isSelected
          ? 'bg-white dark:bg-slate-800'
          : 'bg-white dark:bg-slate-600',
      )}
      style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
    >
      {fileUrl ? (
        <JuiceVideoThumbnailOrImage
          src={fileUrl}
          alt={rewardTier?.name ?? 'Juicebox NFT reward'}
          className="absolute w-full rounded-t-lg"
          heightClass={NFT_DISPLAY_HEIGHT_CLASS}
        />
      ) : null}
    </div>
  )
}
