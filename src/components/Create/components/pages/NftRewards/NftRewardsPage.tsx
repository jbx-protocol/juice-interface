import { AddNftCollectionForm } from 'components/NftRewards/AddNftCollectionForm/AddNftCollectionForm'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { trackFathomGoal } from 'lib/fathom'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/useEditingCreateFurthestPageReached'
import { Wizard } from '../../Wizard/Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useCreateFlowNftRewardsForm } from './hooks/useCreateFlowNftRewardsForm'

export function NftRewardsPage() {
  const { goToNextPage } = useContext(PageContext)

  const { form, initialValues } = useCreateFlowNftRewardsForm()
  useSetCreateFurthestPageReached('nftRewards')

  return (
    <AddNftCollectionForm
      form={form}
      initialValues={initialValues}
      okButton={<Wizard.Page.ButtonControl />}
      onFinish={() => {
        goToNextPage?.()
        trackFathomGoal(CREATE_FLOW.NFT_NEXT_CTA)
      }}
    />
  )
}
