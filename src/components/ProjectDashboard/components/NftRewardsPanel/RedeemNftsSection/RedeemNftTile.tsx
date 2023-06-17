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
          className="h-14 w-14 rounded-lg"
          src={rewardTier?.fileUrl ?? ''}
          alt={_name}
          playIconPosition="hidden"
          showPreviewOnClick
        />
      </div>
    </Tooltip>
  )
}
