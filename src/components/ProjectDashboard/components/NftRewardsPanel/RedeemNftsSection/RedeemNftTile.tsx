import { Tooltip } from 'antd'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { NftRewardTier } from 'models/nftRewards'

export function RedeemNftTile({
  rewardTier,
  tokenId,
}: {
  rewardTier: NftRewardTier | undefined
  tokenId: string
}) {
  const _name = rewardTier?.name ?? `NFT ${tokenId}`
  return (
    <Tooltip title={_name} placement="bottom">
      <div>
        <JuiceVideoThumbnailOrImage
          className="rounded-lg"
          heightClass="h-14"
          widthClass="w-14"
          src={rewardTier?.fileUrl ?? ''}
          alt={_name}
          playIconPosition="hidden"
          showPreviewOnClick
        />
      </div>
    </Tooltip>
  )
}
