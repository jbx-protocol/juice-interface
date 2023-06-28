import { Trans } from '@lingui/macro'
import { NftPreview } from 'components/NftRewards/NftPreview'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useContext, useMemo, useState } from 'react'
import { CartItemBadge } from '../../Cart/components/CartItem/CartItemBadge'
import { SmallNftSquare } from '../../NftRewardsCard/SmallNftSquare'

export const SuccessNftItem = ({ id }: { id: number }) => {
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)

  const openPreview = () => setPreviewVisible(true)
  const closePreview = () => setPreviewVisible(false)

  const rewardTier = useMemo(() => {
    if (!rewardTiers) return undefined
    const nftReward = rewardTiers.find(reward => reward.id === id)
    return nftReward
  }, [id, rewardTiers])

  return (
    <>
      <div className="flex items-center py-5" onClick={openPreview}>
        <SmallNftSquare
          className="h-14 w-14 cursor-pointer"
          nftReward={{
            name: rewardTier?.name ?? '',
            fileUrl: rewardTier?.fileUrl ?? '',
          }}
        />
        <span className="ml-3 text-sm font-medium">
          {rewardTier?.name ?? ''}
        </span>
        <CartItemBadge className="ml-2">
          <Trans>NFT</Trans>
        </CartItemBadge>
      </div>
      {rewardTier && (
        <NftPreview
          open={previewVisible}
          onClose={closePreview}
          rewardTier={rewardTier}
        />
      )}
    </>
  )
}
