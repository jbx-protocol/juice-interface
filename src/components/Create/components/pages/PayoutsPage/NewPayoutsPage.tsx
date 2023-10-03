import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/useEditingCreateFurthestPageReached'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { CreateFlowPayoutsTable } from './components/CreateFlowPayoutsTable'
import { TreasuryOptionsRadio } from './components/TreasuryOptionsRadio'

export const NewPayoutsPage = () => {
  useSetCreateFurthestPageReached('payouts')
  const { goToNextPage } = useContext(PageContext)

  return (
    <CreateFlowPayoutsTable
      onFinish={() => {
        goToNextPage?.()
      }}
      okButton={<Wizard.Page.ButtonControl />}
      topAccessory={<TreasuryOptionsRadio />}
    />
  )
}
