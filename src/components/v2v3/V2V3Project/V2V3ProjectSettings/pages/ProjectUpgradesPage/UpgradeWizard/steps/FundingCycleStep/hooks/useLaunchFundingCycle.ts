import { EditingFundingCycleConfig } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ReconfigureFundingCycleSettingsPage/hooks/editingFundingCycleConfig'
import { getWeightArgument } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ReconfigureFundingCycleSettingsPage/hooks/reconfigureFundingCycle'
import { CV_V3 } from 'constants/cv'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useLoadV2V3Contract } from 'hooks/v2v3/LoadV2V3Contract'
import { useLaunchFundingCyclesTx } from 'hooks/v2v3/transactor/LaunchFundingCyclesTx'
import { CV2V3 } from 'models/cv'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'pages/create/tabs/ReviewDeployTab/DeployProjectWithNftsButton'
import { useCallback, useContext, useState } from 'react'
import { revalidateProject } from 'utils/revalidateProject'

export const useLaunchFundingCycle = ({
  editingFundingCycleConfig,
}: {
  editingFundingCycleConfig: EditingFundingCycleConfig
}) => {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const {
    nftRewards: { CIDs: nftRewardsCids },
  } = useContext(NftRewardsContext)

  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })

  const [launchFundingCycleTxLoading, setLaunchFundingCycleTxLoading] =
    useState<boolean>(false)

  // TODO(@aeolian) make sure this tx uses the V3 contract.
  const launchFundingCycles = useLaunchFundingCyclesTx({
    JBController: V3JBController,
  })

  const {
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    editingFundingCycleMetadata,
    editingFundingCycleData,
    editingFundAccessConstraints,
    editingMustStartAtOrAfter,
  } = editingFundingCycleConfig

  const launchFundingCycle = useCallback(async () => {
    setLaunchFundingCycleTxLoading(true)
    if (
      !(
        fundingCycle &&
        editingFundingCycleData &&
        editingFundingCycleMetadata &&
        editingFundAccessConstraints &&
        projectId
      )
    ) {
      setLaunchFundingCycleTxLoading(false)
      throw new Error('Error deploying project.')
    }

    // Projects with NFT rewards need useDataSourceForPay to be true for NFT rewards to work
    const fundingCycleMetadata = nftRewardsCids?.length
      ? {
          ...editingFundingCycleMetadata,
          ...NFT_FUNDING_CYCLE_METADATA_OVERRIDES,
        }
      : editingFundingCycleMetadata

    const weight = getWeightArgument({
      currentFundingCycleWeight: fundingCycle.weight,
      newFundingCycleWeight: editingFundingCycleData.weight,
    })

    const txSuccessful = await launchFundingCycles(
      {
        projectId,
        fundingCycleData: {
          ...editingFundingCycleData,
          weight,
        },
        fundingCycleMetadata,
        fundAccessConstraints: editingFundAccessConstraints,
        groupedSplits: [
          editingPayoutGroupedSplits,
          editingReservedTokensGroupedSplits,
        ],
        mustStartAtOrAfter: editingMustStartAtOrAfter,
      },
      {
        onDone() {
          console.info(
            'Reconfigure transaction executed. Awaiting confirmation...',
          )
        },
        async onConfirmed() {
          if (projectId) {
            await revalidateProject({
              cv: cv as CV2V3,
              projectId: String(projectId),
            })
          }
          setLaunchFundingCycleTxLoading(false)
        },
      },
    )

    if (!txSuccessful) {
      setLaunchFundingCycleTxLoading(false)
    }
  }, [
    editingFundingCycleData,
    editingFundingCycleMetadata,
    editingFundAccessConstraints,
    editingMustStartAtOrAfter,
    launchFundingCycles,
    editingPayoutGroupedSplits,
    editingReservedTokensGroupedSplits,
    nftRewardsCids,
    fundingCycle,
    projectId,
    cv,
  ])

  return {
    launchFundingCycleLoading: launchFundingCycleTxLoading,
    launchFundingCycle,
  }
}
