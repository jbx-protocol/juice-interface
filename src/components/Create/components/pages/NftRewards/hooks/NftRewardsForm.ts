import { Form } from 'antd'
import { Reward } from 'components/Create/components/RewardsList'
import { useAppSelector } from 'hooks/AppSelector'
import { useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { v4 } from 'uuid'
import { useFormDispatchWatch } from '../../hooks'

type NftRewardsFormProps = Partial<{
  rewards: Reward[]
  collectionName?: string
  collectionSymbol?: string
}>

export const useNftRewardsForm = () => {
  const [form] = Form.useForm<NftRewardsFormProps>()
  const { collectionMetadata, rewardTiers } = useAppSelector(
    state => state.editingV2Project.nftRewards,
  )
  const initialValues: NftRewardsFormProps = useMemo(() => {
    const collectionName = collectionMetadata.name
    const collectionSymbol = collectionMetadata.symbol

    const rewards: Reward[] = rewardTiers?.map(t => ({
      id: v4(),
      title: t.name,
      minimumContribution: t.contributionFloor,
      description: t.description,
      maximumSupply: t.maxSupply,
      url: t.externalLink,
      imgUrl: t.imageUrl,
    }))

    return { rewards, collectionName, collectionSymbol }
  }, [collectionMetadata.name, collectionMetadata.symbol, rewardTiers])

  useFormDispatchWatch({
    form,
    fieldName: 'rewards',
    ignoreUndefined: true, // Needed to stop an infinite loop
    currentValue: rewardTiers,
    dispatchFunction: editingV2ProjectActions.setNftRewardTiers,
    formatter: v => {
      if (!v) return []
      if (typeof v !== 'object') {
        console.error('Invalid type passed to setNftRewardTiers dispatch', v)
        throw new Error('Invalid type passed to setNftRewardTiers dispatch')
      }
      return v.map(reward => ({
        contributionFloor: reward.minimumContribution,
        maxSupply: reward.maximumSupply,
        remainingSupply: reward.maximumSupply,
        imageUrl: reward.imgUrl,
        name: reward.title,
        externalLink: reward.url,
        description: reward.description,
      }))
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'collectionName',
    dispatchFunction: editingV2ProjectActions.setNftRewardsName,
    formatter: v => {
      if (!v || typeof v !== 'string') return ''
      return v
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'collectionSymbol',
    dispatchFunction: editingV2ProjectActions.setNftRewardsSymbol,
    formatter: v => {
      if (!v || typeof v !== 'string') return ''
      return v
    },
  })
  return { form, initialValues }
}
