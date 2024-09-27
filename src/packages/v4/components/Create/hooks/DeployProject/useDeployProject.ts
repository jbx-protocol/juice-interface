import { uploadProjectMetadata } from 'lib/api/ipfs'
import { LaunchTxOpts } from 'packages/v4/hooks/useLaunchProjectTx'
import { useCallback, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/useAppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { emitErrorNotification } from 'utils/notifications'
import { useDeployStandardProject } from './hooks/useDeployStandardProject'

const JUICEBOX_DOMAIN = 'juicebox'

/**
 * Hook that returns a function that deploys a project.
 * @returns A function that deploys a project.
 */
export const useDeployProject = () => {
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>()

  // const isNftProject = useIsNftProject()
  // const uploadNftRewards = useUploadNftRewards()
  // const deployNftProject = useDeployNftProject()

  const deployStandardProject = useDeployStandardProject()

  const {
    projectMetadata,
    nftRewards: { postPayModal },
  } = useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2V3FundAccessConstraintsSelector()

  const dispatch = useAppDispatch()

  const handleDeployFailure = useCallback((error: unknown) => {
    console.error(error)
    emitErrorNotification(`Error deploying project: ${error}`)
    setIsDeploying(false)
    setTransactionPending(false)
  }, [])

  const operationCallbacks = useCallback(
    (
      onProjectDeployed?: (projectId: number) => void,
    ): LaunchTxOpts => ({
      onTransactionPending: () => {
        console.info('Project transaction executed. Await confirmation...')
        setTransactionPending(true)
      },
      onTransactionConfirmed: async (hash, projectId) => {
        // Reset the project state
        dispatch(editingV2ProjectActions.resetState())
        onProjectDeployed?.(projectId)
      },
      onTransactionError: error => {
        console.error(error)
        emitErrorNotification(`Error deploying project: ${error}`)
      },
    }),
    [dispatch],
  )

  /**
   * Deploy a project.
   * @param onProjectDeployed Callback to be called when the project is deployed.
   * @returns The project ID of the deployed project.
   */
  const deployProject = useCallback(
    async ({
      onProjectDeployed,
    }: {
      onProjectDeployed?: (projectId: number) => void
    }) => {
      setIsDeploying(true)
      if (
        !(
          projectMetadata.name &&
          fundingCycleData &&
          fundingCycleMetadata &&
          fundAccessConstraints
        )
      ) {
        setIsDeploying(false)
        throw new Error('Error deploying project.')
      }
      // let nftCids: Awaited<ReturnType<typeof uploadNftRewards>> | undefined
      // try {
      //   if (isNftProject) {
      //     nftCids = await uploadNftRewards()
      //   }
      // } catch (error) {
      //   handleDeployFailure(error)
      //   return
      // }

      let softTargetAmount: string | undefined
      let softTargetCurrency: string | undefined
      let domain = JUICEBOX_DOMAIN

      let projectMetadataCid: string | undefined
      try {
        projectMetadataCid = (
          await uploadProjectMetadata({
            ...projectMetadata,
            domain,
            softTargetAmount,
            softTargetCurrency,
            nftPaymentSuccessModal: postPayModal,
          })
        ).Hash
      } catch (error) {
        handleDeployFailure(error)
        return
      }

      try {
        // let tx
        // if (isNftProject) {
        //   tx = await deployNftProject({
        //     metadataCid: projectMetadataCid,
        //     rewardTierCids: nftCids!.rewardTiers,
        //     nftCollectionMetadataUri: nftCids!.nfCollectionMetadata,
        //     ...operationCallbacks(onProjectDeployed),
        //   })
        // } else {
        const tx = await deployStandardProject({
          metadataCid: projectMetadataCid,
          ...operationCallbacks(onProjectDeployed),
        })
        // }
        // if (!tx) {
        setIsDeploying(false)
        setTransactionPending(false)
        return
        // }
      } catch (error) {
        handleDeployFailure(error)
        return
      }
    },
    [
      // deployNftProject,
      deployStandardProject,
      fundAccessConstraints,
      fundingCycleData,
      fundingCycleMetadata,
      handleDeployFailure,
      // isNftProject,
      operationCallbacks,
      postPayModal,
      projectMetadata,
      // uploadNftRewards,
    ],
  )
  return {
    isDeploying,
    deployTransactionPending: transactionPending,
    deployProject,
  }
}
