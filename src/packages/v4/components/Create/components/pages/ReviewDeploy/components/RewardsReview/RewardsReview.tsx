import { t } from '@lingui/macro'
import { RewardsList } from 'components/NftRewards/RewardsList/RewardsList'
import { NftRewardTier } from 'models/nftRewards'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { formatEnabled } from 'utils/format/formatBoolean'
import { v4 } from 'uuid'
import { ReviewDescription } from '../ReviewDescription'

export const RewardsReview = () => {
  const {
    nftRewards: { rewardTiers, flags },
    fundingCycleMetadata,
  } = useAppSelector(state => state.editingV2Project)

  const dispatch = useAppDispatch()

  const rewards: NftRewardTier[] = useMemo(() => {
    return (
      rewardTiers?.map(t => ({
        id: parseInt(v4()),
        name: t.name,
        contributionFloor: t.contributionFloor,
        description: t.description,
        maxSupply: t.maxSupply,
        remainingSupply: t.maxSupply,
        externalLink: t.externalLink,
        fileUrl: t.fileUrl,
        beneficiary: t.beneficiary,
        reservedRate: t.reservedRate,
        votingWeight: t.votingWeight,
      })) ?? []
    )
  }, [rewardTiers])

  const setRewards = useCallback(
    (rewards: NftRewardTier[]) => {
      dispatch(
        editingV2ProjectActions.setNftRewardTiers(
          rewards.map(reward => ({
            contributionFloor: reward.contributionFloor,
            maxSupply: reward.maxSupply,
            remainingSupply: reward.maxSupply,
            id: reward.id,
            fileUrl: reward.fileUrl,
            name: reward.name,
            externalLink: reward.externalLink,
            description: reward.description,
            beneficiary: reward.beneficiary,
            reservedRate: reward.reservedRate,
            votingWeight: reward.votingWeight,
          })),
        ),
      )
    },
    [dispatch],
  )

  const shouldUseDataSourceForRedeem = useMemo(() => {
    return formatEnabled(fundingCycleMetadata.useDataSourceForRedeem)
  }, [fundingCycleMetadata.useDataSourceForRedeem])

  const preventOverspending = useMemo(() => {
    return formatEnabled(flags.preventOverspending)
  }, [flags.preventOverspending])

  return (
    <div className="flex flex-col gap-12">
      <RewardsList value={rewards} onChange={setRewards} />
      <div className="flex flex-col gap-12 md:flex-row">
        <ReviewDescription
          title={t`Use NFTs for redemptions`}
          desc={
            <div className="text-base font-medium">
              {shouldUseDataSourceForRedeem}
            </div>
          }
        />
        <ReviewDescription
          title={t`Prevent NFT overspending`}
          desc={
            <div className="text-base font-medium">{preventOverspending}</div>
          }
        />
      </div>
    </div>
  )
}
