import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { useLaunchProjectTx } from 'hooks/v2v3/transactor/LaunchProjectTx'
import { TransactionCallbacks } from 'models/transaction'
import { useCallback } from 'react'

/**
 * Hook that returns a function that deploys a project.
 *
 * The distinction is made between standard and NFT projects because the NFT
 * project contract uses more gas.
 * @returns A function that deploys a project.
 */
export const useDeployStandardProject = () => {
  const launchProject = useLaunchProjectTx()
  const { payoutGroupedSplits, reservedTokensGroupedSplits } = useAppSelector(
    state => state.editingV2Project,
  )
  const fundingCycleMetadata = useEditingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2V3FundAccessConstraintsSelector()

  const deployStandardProjectCallback = useCallback(
    async ({
      metadataCid,

      onDone,
      onConfirmed,
      onCancelled,
    }: {
      metadataCid: string
    } & Pick<
      TransactionCallbacks,
      'onCancelled' | 'onConfirmed' | 'onDone'
    >) => {
      const groupedSplits = [payoutGroupedSplits, reservedTokensGroupedSplits]
      return await launchProject(
        {
          projectMetadataCID: metadataCid,
          fundingCycleData,
          fundingCycleMetadata,
          fundAccessConstraints,
          groupedSplits,
        },
        {
          onDone,
          onConfirmed,
          onCancelled,
        },
      )
    },
    [
      payoutGroupedSplits,
      reservedTokensGroupedSplits,
      launchProject,
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
    ],
  )

  return deployStandardProjectCallback
}
