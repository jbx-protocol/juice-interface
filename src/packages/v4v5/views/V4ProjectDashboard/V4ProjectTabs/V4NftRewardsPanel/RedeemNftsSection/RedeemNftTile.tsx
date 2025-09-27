import { Tooltip } from 'antd'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { NftRewardTier } from 'models/nftRewards'
import { useMemo } from 'react'
import { pinataToGatewayUrl } from 'utils/ipfs'

export function RedeemNftTile({
  rewardTier,
  tokenId,
}: {
  rewardTier: NftRewardTier | undefined
  tokenId: string
}) {
  const _name = rewardTier?.name ?? `NFT ${tokenId}`
  const fileUrl = useMemo(() => {
    if (!rewardTier?.fileUrl) return
    return pinataToGatewayUrl(rewardTier.fileUrl)
  }, [rewardTier?.fileUrl])
  return (
    <Tooltip title={_name} placement="bottom">
      <div>
        <JuiceVideoThumbnailOrImage
          className="h-14 w-14 rounded-lg"
          src={fileUrl ?? ''}
          alt={_name}
          playIconPosition="hidden"
          showPreviewOnClick
        />
      </div>
    </Tooltip>
  )
}
