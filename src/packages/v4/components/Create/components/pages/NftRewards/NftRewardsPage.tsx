import { AddNftCollectionForm } from 'components/NftRewards/AddNftCollectionForm/AddNftCollectionForm'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { NATIVE_TOKEN_SYMBOLS } from 'juice-sdk-core'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { SUPPORTED_JB_MULTITERMINAL_ADDRESS } from 'packages/v4/hooks/useLaunchProjectTx'
import { Wizard } from '../../Wizard/Wizard'
import { trackFathomGoal } from 'lib/fathom'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useChainId } from 'wagmi'
import { useContext } from 'react'
import { useCreateFlowNftRewardsForm } from './hooks/useCreateFlowNftRewardsForm'
import { useSetCreateFurthestPageReached } from 'redux/hooks/useEditingCreateFurthestPageReached'

export function NftRewardsPage() {
  const { goToNextPage } = useContext(PageContext)

  const { form, initialValues } = useCreateFlowNftRewardsForm()

  const postPayModalData = useAppSelector(
    state => state.creatingV2Project.nftRewards.postPayModal,
  )
  const nftRewardsData = useAppSelector(
    state => state.creatingV2Project.nftRewards,
  )

  useSetCreateFurthestPageReached('nftRewards')

  const chainId = useChainId()
  const chainIdStr =
    chainId?.toString() as keyof typeof SUPPORTED_JB_MULTITERMINAL_ADDRESS

  return (
    <AddNftCollectionForm
      form={form}
      initialValues={initialValues}
      postPayModalData={postPayModalData}
      nftRewardsData={nftRewardsData}
      okButton={<Wizard.Page.ButtonControl />}
      priceCurrencySymbol={NATIVE_TOKEN_SYMBOLS[chainIdStr]}
      onFinish={() => {
        goToNextPage?.()
        trackFathomGoal(CREATE_FLOW.NFT_NEXT_CTA)
      }}
    />
  )
}
