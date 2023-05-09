import { useLaunchProjectTx } from 'hooks/v2v3/transactor/useLaunchProjectTx'
import { TransactionCallbacks } from 'models/transaction'
import { useCallback } from 'react'
import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/useAppSelector'

/**
 * Hook that returns a function that deploys a project.
 *
 * The distinction is made between standard and NFT projects because the NFT
 * project contract uses more gas.
 * @returns A function that deploys a project.
 */
export const useDeployStandardProject = () => {
  const launchProject = useLaunchProjectTx()
  const {
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    inputProjectOwner,
    mustStartAtOrAfter,
  } = useAppSelector(state => state.editingV2Project)
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
          owner: inputProjectOwner?.length ? inputProjectOwner : undefined,
          projectMetadataCID: metadataCid,
          fundingCycleData,
          fundingCycleMetadata,
          mustStartAtOrAfter,
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
      inputProjectOwner,
      fundingCycleData,
      fundingCycleMetadata,
      mustStartAtOrAfter,
      fundAccessConstraints,
    ],
  )

  return deployStandardProjectCallback
}
