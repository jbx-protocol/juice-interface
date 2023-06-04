import { Trans } from '@lingui/macro'
import { NftReward } from './NftReward'
import { useNftRewards } from './hooks/useNftRewards'

export const NftRewardsPanel = () => {
  const {
    rewardTiers,
    handleTierSelect,
    loading: nftsLoading,
  } = useNftRewards()

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <h2 className="font-heading text-2xl font-medium">
        <Trans>NFTs</Trans>
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {rewardTiers?.map((tier, i) => (
          <NftReward
            key={i}
            rewardTier={tier}
            loading={nftsLoading}
            onSelect={(quantity = 1) => handleTierSelect(tier.id, quantity)}
          />
        ))}
      </div>
    </div>
  )
}
