import { t } from '@lingui/macro'
import { Row } from 'antd'
import { RewardsList } from 'components/Create/components/RewardsList'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { JB721GovernanceType, NftRewardTier } from 'models/nftRewards'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { featureFlagEnabled } from 'utils/featureFlags'
import { formatEnabled } from 'utils/format/formatBoolean'
import { v4 } from 'uuid'
import { DescriptionCol } from '../DescriptionCol'

export const RewardsReview = () => {
  const {
    nftRewards: { rewardTiers, flags, governanceType },
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

  const delegateV1_1Enabled = featureFlagEnabled(FEATURE_FLAGS.DELEGATE_V1_1)

  const onChainGovernance = useMemo(() => {
    switch (governanceType) {
      case JB721GovernanceType.GLOBAL:
        return t`Standard`
      case JB721GovernanceType.TIERED:
        return `Tiered`
      case JB721GovernanceType.NONE:
      default:
        return t`None`
    }
  }, [governanceType])

  return (
    <>
      <RewardsList value={rewards} onChange={setRewards} />
      <Row gutter={20} className="mt-4">
        <DescriptionCol
          span={6}
          title={t`Redeemable NFTs`}
          desc={
            <div className="text-base font-medium">
              {shouldUseDataSourceForRedeem}
            </div>
          }
        />
        <DescriptionCol
          span={6}
          title={t`Governance type`}
          desc={
            <div className="text-base font-medium">{onChainGovernance}</div>
          }
        />
        {delegateV1_1Enabled ? (
          <DescriptionCol
            span={6}
            title={t`Prevent NFT overspending`}
            desc={
              <div className="text-base font-medium">{preventOverspending}</div>
            }
          />
        ) : null}
      </Row>
    </>
  )
}
