import { Trans } from '@lingui/macro'
import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import { useContext } from 'react'

export const V4NftRewardsPanel = () => {
  const x = useContext(NftRewardsContext)
  const rewardTiers = x.nftRewards.rewardTiers

  return (
    <div className="flex w-full flex-col gap-5">
      <h2 className="font-heading text-2xl font-medium mb-2">
        <Trans>NFTs</Trans>
      </h2>

      {rewardTiers?.map((tier, i) => (
        <div key={tier.id} className="flex">
          {tier.id}
        </div>
      ))}

      {/* {!nftsLoading && rewardTiers?.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6">
          {rewardTiers?.map((tier, i) => (
            <div key={i} className="flex">
              <NftReward
                className="min-w-0"
                rewardTier={tier}
                loading={nftsLoading}
                onSelect={(quantity = 1) => handleTierSelect(tier.id, quantity)}
                onDeselect={() => handleTierDeselect(tier.id)}
              />
            </div>
          ))}
        </div>
      ) : nftsLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <NftRewardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <EmptyScreen subtitle={t`This project has no NFTs`} />
      )} */}
    </div>
  )
}
