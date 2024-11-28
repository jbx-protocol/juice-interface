import { TransactionCallbacks } from 'models/transaction'
import { useLaunchProjectTx } from 'packages/v2v3/hooks/transactor/useLaunchProjectTx'
import { useCallback } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  useCreatingV2V3FundAccessConstraintsSelector,
  useCreatingV2V3FundingCycleDataSelector,
  useCreatingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/v2v3/create'

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
  } = useAppSelector(state => state.creatingV2Project)
  const fundingCycleMetadata = useCreatingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useCreatingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useCreatingV2V3FundAccessConstraintsSelector()

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
