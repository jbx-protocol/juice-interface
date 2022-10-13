import { FormItemInput } from 'models/formItemInput'
import { useState } from 'react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { v4 } from 'uuid'
import { Reward } from '../types'

export const useRewards = ({ value, onChange }: FormItemInput<Reward[]>) => {
  const [_rewards, _setRewards] = useState<Reward[]>()
  const rewards = value ?? _rewards
  const setRewards = onChange ?? _setRewards
  console.info('TODO', { rewards, setRewards })

  return {
    // TODO: Placeholder data
    rewards: [
      {
        id: v4(),
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, egestas fermentum tristique nunc cum non porttitor donec nam. Nunc, neque, ac velit.',
        imgUrl: new URL('/assets/pina.png', window.location.origin),
        minimumContribution: {
          amount: 1,
          currency: V2V3_CURRENCY_ETH,
        },
        tier: 1,
        title: 'Flamingo Sunday',
        maximumSupply: 10000,
        url: new URL('https://www.juicebox.money'),
      },
      {
        id: v4(),
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, egestas fermentum tristique nunc cum non porttitor donec nam. Nunc, neque, ac velit.',
        imgUrl: new URL('/assets/orange_lady-od.png', window.location.origin),
        minimumContribution: {
          amount: 1,
          currency: V2V3_CURRENCY_ETH,
        },
        tier: 2,
        title: 'Flamingo Sunday 2',
        maximumSupply: 10000,
        url: new URL('https://www.juicebox.money'),
      },
    ],
  }
}
