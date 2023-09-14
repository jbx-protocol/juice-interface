import { useArray } from 'hooks/useArray'
import { FormItemInput } from 'models/formItemInput'
import { NftRewardTier } from 'models/nftRewards'

export const useRewards = ({
  value,
  onChange,
}: FormItemInput<NftRewardTier[]>) => {
  const {
    values: rewards,
    add: addReward,
    remove: removeReward,
    upsert: upsertReward,
  } = useArray<NftRewardTier>([value, onChange])

  return {
    rewards,
    addReward,
    removeReward,
    upsertReward,
  }
}
