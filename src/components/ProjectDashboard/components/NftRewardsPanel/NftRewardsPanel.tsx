import { Trans, t } from '@lingui/macro'
import { EmptyScreen } from '../EmptyScreen'
import { NftReward } from './NftReward'
import { RedeemNftsSection } from './RedeemNftsSection'
import { useNftRewardsPanel } from './hooks/useNftRewardsPanel'

export const NftRewardsPanel = () => {
  const {
    rewardTiers,
    handleTierSelect,
    handleTierDeselect,
    loading: nftsLoading,
  } = useNftRewardsPanel()

  return (
    <div className="flex w-full max-w-[800px] flex-col gap-5">
      <h2 className="font-heading text-2xl font-medium">
        <Trans>NFTs</Trans>
      </h2>
      <RedeemNftsSection />
      {!nftsLoading && rewardTiers?.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {rewardTiers?.map((tier, i) => (
            <div key={i} className="flex justify-center">
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
      ) : (
        <EmptyScreen subtitle={t`This project has no NFTs`} />
      )}
    </div>
  )
}
