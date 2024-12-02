import { useContext } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useSetCreateFurthestPageReached } from 'redux/hooks/useEditingCreateFurthestPageReached'
import { Wizard } from '../../Wizard/Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { CreateFlowPayoutsTable } from './components/CreateFlowPayoutsTable'
import { TreasuryOptionsRadio } from './components/TreasuryOptionsRadio'

export const PayoutsPage = () => {
  const treasurySelection = useAppSelector(
    state => state.creatingV2Project.treasurySelection,
  )

  useSetCreateFurthestPageReached('payouts')
  const { goToNextPage } = useContext(PageContext)

  return (
    <CreateFlowPayoutsTable
      createTreasurySelection={treasurySelection}
      onFinish={() => {
        goToNextPage?.()
      }}
      okButton={<Wizard.Page.ButtonControl />}
      topAccessory={<TreasuryOptionsRadio />}
    />
  )
}
