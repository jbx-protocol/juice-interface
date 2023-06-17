import { Trans } from '@lingui/macro'
import { NftReward } from './NftReward'
import { RedeemNftsSection } from './RedeemNftsSection'

import { useNftRewardsPanel } from './hooks/useNftRewardsPanel'

export const NftRewardsPanel = () => {
  const {
    rewardTiers,
    handleTierSelect,
    loading: nftsLoading,
  } = useNftRewardsPanel()

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <h2 className="font-heading text-2xl font-medium">
        <Trans>NFTs</Trans>
      </h2>
      <RedeemNftsSection />
      {!nftsLoading && rewardTiers?.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {rewardTiers?.map((tier, i) => (
            <NftReward
              key={i}
              rewardTier={tier}
              loading={nftsLoading}
              onSelect={(quantity = 1) => handleTierSelect(tier.id, quantity)}
            />
          ))}
        </div>
      ) : (
        <div className="text-grey-500 dark:text-slate-200">
          <Trans>No NFTs have been configured for this project.</Trans>
        </div>
      )}
    </div>
  )
}
