import { Form } from 'antd'
import { Reward } from 'components/Create/components/RewardsList'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useEffect, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { withHttps, withoutHttp } from 'utils/externalLink'
import { v4 } from 'uuid'
import { useFormDispatchWatch } from '../../hooks'

type NftRewardsFormProps = Partial<{
  rewards: Reward[]
  collectionName?: string
  collectionSymbol?: string
  collectionDescription?: string
  postPayMessage?: string
  postPayButtonText?: string
  postPayButtonLink?: string
}>

export const useNftRewardsForm = () => {
  const [form] = Form.useForm<NftRewardsFormProps>()
  const { collectionMetadata, rewardTiers, postPayModal } = useAppSelector(
    state => state.editingV2Project.nftRewards,
  )
  const initialValues: NftRewardsFormProps = useMemo(() => {
    const collectionName = collectionMetadata.name
    const collectionSymbol = collectionMetadata.symbol
    const collectionDescription = collectionMetadata.description

    const rewards: Reward[] = rewardTiers?.map(t => ({
      id: v4(),
      title: t.name,
      minimumContribution: t.contributionFloor,
      description: t.description,
      maximumSupply: t.maxSupply,
      url: t.externalLink,
      imgUrl: t.imageUrl,
    }))

    return {
      rewards,
      collectionName,
      collectionSymbol,
      collectionDescription,
      postPayMessage: postPayModal?.content,
      postPayButtonText: postPayModal?.ctaText,
      postPayButtonLink: withoutHttp(postPayModal?.ctaLink),
    }
  }, [
    collectionMetadata.description,
    collectionMetadata.name,
    collectionMetadata.symbol,
    postPayModal?.content,
    postPayModal?.ctaLink,
    postPayModal?.ctaText,
    rewardTiers,
  ])

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
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setNftRewardsName,
    formatter: v => {
      if (!v || typeof v !== 'string') return ''
      return v
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'collectionSymbol',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setNftRewardsSymbol,
    formatter: v => {
      if (!v || typeof v !== 'string') return ''
      return v
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'collectionDescription',
    ignoreUndefined: true,
    dispatchFunction:
      editingV2ProjectActions.setNftRewardsCollectionDescription,
    formatter: v => {
      if (!v || typeof v !== 'string') return ''
      return v
    },
  })

  const dispatch = useAppDispatch()
  const postPayMessage = Form.useWatch('postPayMessage', form)
  const postPayButtonText = Form.useWatch('postPayButtonText', form)
  const postPayButtonLink = Form.useWatch('postPayButtonLink', form)
  const postPayFormProps = useMemo(
    () =>
      postPayMessage === undefined &&
      postPayButtonText === undefined &&
      postPayButtonLink === undefined
        ? undefined
        : {
            postPayMessage,
            postPayButtonText,
            postPayButtonLink,
          },
    [postPayButtonLink, postPayButtonText, postPayMessage],
  )

  useEffect(() => {
    // This will occur when the page is loaded with the payment success popup collapsed.
    if (postPayFormProps === undefined) return
    if (
      postPayMessage === undefined &&
      postPayButtonText === undefined &&
      postPayButtonLink === undefined
    ) {
      dispatch(editingV2ProjectActions.setNftPostPayModalConfig(undefined))
      return
    }
    dispatch(
      editingV2ProjectActions.setNftPostPayModalConfig({
        content: postPayMessage,
        ctaText: postPayButtonText,
        ctaLink: withHttps(postPayButtonLink),
      }),
    )
  }, [
    dispatch,
    form,
    postPayButtonLink,
    postPayButtonText,
    postPayFormProps,
    postPayMessage,
  ])
  return { form, initialValues }
}
