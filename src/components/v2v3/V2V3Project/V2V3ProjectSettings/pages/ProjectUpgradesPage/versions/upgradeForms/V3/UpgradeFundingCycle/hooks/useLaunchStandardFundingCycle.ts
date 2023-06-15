import { EditingFundingCycleConfig } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ReconfigureFundingCycleSettingsPage/hooks/useEditingFundingCycleConfig'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useLaunchFundingCyclesTx } from 'hooks/v2v3/transactor/useLaunchFundingCyclesTx'
import { TransactionCallbacks } from 'models/transaction'
import { useContext } from 'react'
import { useLaunchFundingCyclesData } from './useLaunchFundingCyclesData'

export function useLaunchStandardFundingCycles(
  editingFundingCycleConfig: EditingFundingCycleConfig,
) {
  const { projectId } = useContext(ProjectMetadataContext)

  const launchData = useLaunchFundingCyclesData({ editingFundingCycleConfig })
  const launchFundingCycles = useLaunchFundingCyclesTx()

  return (callbacks: TransactionCallbacks) => {
    if (!launchData || !projectId) {
      throw new Error('Failed to launch funding cycle. Some data was missing.')
    }

    return launchFundingCycles({ projectId, ...launchData }, callbacks)
  }
}
