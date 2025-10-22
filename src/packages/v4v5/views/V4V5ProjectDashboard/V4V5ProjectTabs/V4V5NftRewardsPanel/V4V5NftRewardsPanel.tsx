import { Trans, t } from '@lingui/macro'
import { forwardRef } from 'react'
import { NftReward, NftRewardSkeleton } from './NftReward/NftReward'

import { Button } from 'antd'
import { EmptyScreen } from 'components/Project/ProjectTabs/EmptyScreen'
import { useWallet } from 'hooks/Wallet/useWallet'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { useV4V5ProjectHeader } from 'packages/v4v5/views/V4V5ProjectDashboard/hooks/useV4V5ProjectHeader'
import { useRouter } from 'next/router'
import { RedeemNftsSection } from './RedeemNftsSection/RedeemNftsSection'
import { useNftRewardsPanel } from './hooks/useNftRewardsPanel'

export const V4V5NftRewardsPanel = forwardRef<HTMLDivElement>((props, ref) => {
  const {
    rewardTiers,
    handleTierSelect,
    handleTierDeselect,
    loading: nftsLoading,
  } = useNftRewardsPanel()

  const router = useRouter()
  const { userAddress } = useWallet()
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()
  const { isRevnet, operatorAddress } = useV4V5ProjectHeader()

  // Check if user can add NFTs (project owner or revnet operator)
  const canAddNfts =
    userAddress &&
    (userAddress.toLowerCase() === projectOwnerAddress?.toLowerCase() ||
      (isRevnet &&
        userAddress.toLowerCase() === operatorAddress?.toLowerCase()))

  return (
    <div ref={ref} className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-medium">
          <Trans>NFTs</Trans>
        </h2>
        {canAddNfts && rewardTiers?.length ? (
          <Button type="primary" onClick={() => router.push('/settings/nfts')}>
            <Trans>Add NFT Tier</Trans>
          </Button>
        ) : null}
      </div>
      <RedeemNftsSection />

      {!nftsLoading && rewardTiers?.length ? (
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
      ) : canAddNfts ? (
        <div className="flex flex-col items-center gap-4">
          <EmptyScreen subtitle={t`This project has no NFTs`} />
          <Button
            type="primary"
            size="large"
            onClick={() => router.push('/settings/nfts')}
          >
            <Trans>Create NFT Rewards</Trans>
          </Button>
        </div>
      ) : (
        <EmptyScreen subtitle={t`This project has no NFTs`} />
      )}
    </div>
  )
})

V4V5NftRewardsPanel.displayName = 'V4V5NftRewardsPanel'
