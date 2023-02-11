import { EditingFundingCycleConfig } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ReconfigureFundingCycleSettingsPage/hooks/editingFundingCycleConfig'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useLaunchFundingCyclesWithNftsTx } from 'hooks/JB721Delegate/transactor/LaunchFundingCyclesWithNftsTx'
import { LaunchFundingCyclesData } from 'hooks/v2v3/transactor/LaunchFundingCyclesTx'
import { TransactionCallbacks } from 'models/transaction'
import { useContext } from 'react'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'utils/nftFundingCycleMetadataOverrides'
import { useLaunchFundingCyclesData } from './LaunchFundingCyclesData'

function transformLaunchDataForNfts(
  launchData: LaunchFundingCyclesData,
): LaunchFundingCyclesData {
  return {
    ...launchData,
    fundingCycleMetadata: {
      ...launchData?.fundingCycleMetadata,
      ...NFT_FUNDING_CYCLE_METADATA_OVERRIDES,
    },
  }
}

export function useLaunchNftFundingCycles(
  editingFundingCycleConfig: EditingFundingCycleConfig,
) {
  const { projectId } = useContext(ProjectMetadataContext)

  const launchFundingCyclesWithNfts = useLaunchFundingCyclesWithNftsTx()
  const launchData = useLaunchFundingCyclesData({ editingFundingCycleConfig })
  const launchNftFundingCyclesData = launchData
    ? transformLaunchDataForNfts(launchData)
    : undefined

  const { editingNftRewards } = editingFundingCycleConfig

  return (callbacks: TransactionCallbacks) => {
    if (!launchNftFundingCyclesData || !editingNftRewards || !projectId) {
      throw new Error('Failed to launch funding cycle. Some data was missing.')
    }

    return launchFundingCyclesWithNfts(
      {
        projectId,
        launchFundingCyclesData: launchNftFundingCyclesData,
        tiered721DelegateData: editingNftRewards,
      },
      callbacks,
    )
  }
}
