import { AddNftCollectionForm } from 'components/NftRewards/AddNftCollectionForm/AddNftCollectionForm'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { V2V3_CURRENCY_USD } from 'packages/v2v3/utils/currency'
import { Wizard } from '../../Wizard/Wizard'
import { trackFathomGoal } from 'lib/fathom'
import { useAppSelector } from 'redux/hooks/useAppSelector'
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

  const nftCurrency = nftRewardsData?.pricing.currency

  return (
    <AddNftCollectionForm
      form={form}
      priceCurrencySymbol={nftCurrency === V2V3_CURRENCY_USD ? 'USD' : 'ETH'}
      initialValues={initialValues}
      postPayModalData={postPayModalData}
      nftRewardsData={nftRewardsData}
      okButton={<Wizard.Page.ButtonControl />}
      onFinish={() => {
        goToNextPage?.()
        trackFathomGoal(CREATE_FLOW.NFT_NEXT_CTA)
      }}
    />
  )
}
