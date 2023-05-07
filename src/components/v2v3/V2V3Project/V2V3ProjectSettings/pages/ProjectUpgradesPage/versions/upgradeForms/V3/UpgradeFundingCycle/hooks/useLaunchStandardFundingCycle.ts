import { EditingFundingCycleConfig } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ReconfigureFundingCycleSettingsPage/hooks/useEditingFundingCycleConfig'
import { CV_V3 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useLaunchFundingCyclesTx } from 'hooks/v2v3/transactor/useLaunchFundingCyclesTx'
import { useLoadV2V3Contract } from 'hooks/v2v3/useLoadV2V3Contract'
import { TransactionCallbacks } from 'models/transaction'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { useLaunchFundingCyclesData } from './useLaunchFundingCyclesData'

export function useLaunchStandardFundingCycles(
  editingFundingCycleConfig: EditingFundingCycleConfig,
) {
  const { projectId } = useContext(ProjectMetadataContext)

  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })
  const launchData = useLaunchFundingCyclesData({ editingFundingCycleConfig })
  const launchFundingCycles = useLaunchFundingCyclesTx({
    JBController: V3JBController,
  })

  return (callbacks: TransactionCallbacks) => {
    if (!launchData || !projectId) {
      throw new Error('Failed to launch funding cycle. Some data was missing.')
    }

    return launchFundingCycles({ projectId, ...launchData }, callbacks)
  }
}
