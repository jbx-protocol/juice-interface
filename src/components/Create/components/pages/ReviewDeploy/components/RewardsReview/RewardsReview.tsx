import { Reward, RewardsList } from 'components/Create/components/RewardsList'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { v4 } from 'uuid'

export const RewardsReview = () => {
  const { rewardTiers } = useAppSelector(
    state => state.editingV2Project.nftRewards,
  )
  const dispatch = useAppDispatch()

  const rewards = useMemo(() => {
    return (
      rewardTiers?.map(t => ({
        id: v4(),
        title: t.name,
        minimumContribution: t.contributionFloor,
        description: t.description,
        maximumSupply: t.maxSupply,
        url: t.externalLink,
        imgUrl: t.imageUrl,
      })) ?? []
    )
  }, [rewardTiers])

  const setRewards = useCallback(
    (rewards: Reward[]) => {
      dispatch(
        editingV2ProjectActions.setNftRewardTiers(
          rewards.map(reward => ({
            contributionFloor: reward.minimumContribution,
            maxSupply: reward.maximumSupply,
            remainingSupply: reward.maximumSupply,
            imageUrl: reward.imgUrl,
            name: reward.title,
            externalLink: reward.url,
            description: reward.description,
          })),
        ),
      )
    },
    [dispatch],
  )

  return <RewardsList value={rewards} onChange={setRewards} />
}
