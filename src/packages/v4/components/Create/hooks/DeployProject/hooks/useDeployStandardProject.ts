import { LaunchTxOpts, useLaunchProjectTx } from 'packages/v4/hooks/useLaunchProjectTx'
import { useCallback } from 'react'
import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/useAppSelector'

/**
 * Hook that returns a function that deploys a v4 project.
 *
 * Takes data from the redux store built for v2v3 projects, data is converted to v4 format in useLaunchProjectTx.
 * @returns A function that deploys a project.
 */
export const useDeployStandardProject = () => {
  const launchProjectTx = useLaunchProjectTx()
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
      onTransactionPending,
      onTransactionConfirmed,
      onTransactionError
    }: {
      metadataCid: string
    } & LaunchTxOpts) => {
      const groupedSplits = [payoutGroupedSplits, reservedTokensGroupedSplits]
      return await launchProjectTx(
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
          onTransactionPending,
          onTransactionConfirmed,
          onTransactionError
        },
      )
    },
    [
      payoutGroupedSplits,
      reservedTokensGroupedSplits,
      launchProjectTx,
      inputProjectOwner,
      fundingCycleData,
      fundingCycleMetadata,
      mustStartAtOrAfter,
      fundAccessConstraints,
    ],
  )

  return deployStandardProjectCallback
}
