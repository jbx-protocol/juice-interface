import { Form } from 'antd'
import { NftRewardsFormProps } from 'components/NftRewards/AddNftCollectionForm/AddNftCollectionForm'
import { NftRewardTier } from 'models/nftRewards'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { withHttps, withoutHttp } from 'utils/externalLink'
import {
  defaultNftCollectionDescription,
  defaultNftCollectionName,
} from 'utils/nftRewards'
import { useFormDispatchWatch } from '../../hooks/useFormDispatchWatch'

export const useCreateFlowNftRewardsForm = () => {
  const [form] = Form.useForm<NftRewardsFormProps>()
  const {
    collectionMetadata,
    rewardTiers,
    postPayModal,
    governanceType,
    flags,
  } = useAppSelector(state => state.editingV2Project.nftRewards)
  const { projectMetadata, fundingCycleMetadata } = useAppSelector(
    state => state.editingV2Project,
  )
  const initialValues: NftRewardsFormProps = useMemo(() => {
    const collectionName =
      collectionMetadata?.name ??
      defaultNftCollectionName(projectMetadata.name!)
    const collectionDescription =
      collectionMetadata?.description ??
      defaultNftCollectionDescription(projectMetadata.name!)
    const collectionSymbol = collectionMetadata?.symbol

    const rewards: NftRewardTier[] =
      rewardTiers?.map(t => ({
        id: Math.floor(Math.random() * 1000000),
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

    return {
      rewards,
      onChainGovernance: governanceType,
      useDataSourceForRedeem: fundingCycleMetadata.useDataSourceForRedeem,
      preventOverspending: flags?.preventOverspending,
      collectionName,
      collectionSymbol,
      collectionDescription,
      postPayMessage: postPayModal?.content,
      postPayButtonText: postPayModal?.ctaText,
      postPayButtonLink: withoutHttp(postPayModal?.ctaLink),
    }
  }, [
    collectionMetadata?.name,
    collectionMetadata?.description,
    collectionMetadata?.symbol,
    projectMetadata.name,
    rewardTiers,
    governanceType,
    postPayModal?.content,
    postPayModal?.ctaText,
    postPayModal?.ctaLink,
    fundingCycleMetadata.useDataSourceForRedeem,
    flags.preventOverspending,
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
        contributionFloor: reward.contributionFloor,
        maxSupply: reward.maxSupply,
        remainingSupply: reward.maxSupply,
        fileUrl: reward.fileUrl,
        name: reward.name,
        id: reward.id,
        externalLink: reward.externalLink,
        description: reward.description,
        beneficiary: reward.beneficiary,
        reservedRate: reward.reservedRate,
        votingWeight: reward.votingWeight,
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

  useFormDispatchWatch({
    form,
    fieldName: 'useDataSourceForRedeem',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setUseDataSourceForRedeem,
    formatter: v => !!v,
  })

  useFormDispatchWatch({
    form,
    fieldName: 'preventOverspending',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setNftPreventOverspending,
    formatter: v => !!v,
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
