import { Trans } from '@lingui/macro'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useContext, useMemo } from 'react'
import { CartItemBadge } from '../../Cart/components/CartItem/CartItemBadge'
import { SmallNftSquare } from '../../NftRewardsCard/SmallNftSquare'

export const SuccessNftItem = ({ id }: { id: number }) => {
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)

  const { fileUrl, name } =
    useMemo(() => {
      if (!rewardTiers) return undefined
      const nftReward = rewardTiers.find(reward => reward.id === id)
      return {
        fileUrl: nftReward?.fileUrl,
        name: nftReward?.name,
      }
    }, [id, rewardTiers]) ?? {}

  return (
    <div className="flex items-center py-5">
      <SmallNftSquare
        className="h-14 w-14"
        nftReward={{
          name: name ?? '',
          fileUrl: fileUrl ?? '',
        }}
      />
      <span className="ml-3 text-sm font-medium">{name}</span>
      <CartItemBadge className="ml-2">
        <Trans>NFT</Trans>
      </CartItemBadge>
    </div>
  )
}
