import { useArray } from 'hooks/Array'
import { FormItemInput } from 'models/formItemInput'
import { Reward } from '../types'

export const useRewards = ({ value, onChange }: FormItemInput<Reward[]>) => {
  const {
    values: rewards,
    add: addReward,
    remove: removeReward,
    upsert: upsertReward,
  } = useArray<Reward>([value, onChange])

  return {
    rewards,
    addReward,
    removeReward,
    upsertReward,
  }
}
