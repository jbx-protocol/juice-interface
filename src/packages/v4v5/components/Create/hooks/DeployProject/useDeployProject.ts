import { useCallback, useState } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'

import { JBChainId } from 'juice-sdk-react'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { LaunchTxOpts } from 'packages/v4v5/hooks/useLaunchProjectTx'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import {
  useCreatingV2V3FundAccessConstraintsSelector,
  useCreatingV2V3FundingCycleDataSelector,
  useCreatingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/v2v3/create'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
import { emitErrorNotification } from 'utils/notifications'
import { useDeployNftProject } from './hooks/NFT/useDeployNftProject'
import { useIsNftProject } from './hooks/NFT/useIsNftProject'
import { useUploadNftRewards } from './hooks/NFT/useUploadNftRewards'
import { useDeployStandardProject } from './hooks/useDeployStandardProject'

const JUICEBOX_DOMAIN = 'juicebox'

/**
 * Hook that returns a function that deploys a project.
 * @returns A function that deploys a project.
 */
export const useDeployProject = () => {
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const isNftProject = useIsNftProject()
  const uploadNftRewards = useUploadNftRewards()
  const deployNftProject = useDeployNftProject()
  const deployStandardProject = useDeployStandardProject()

  const {
    projectMetadata,
    nftRewards: { postPayModal },
  } = useAppSelector(state => state.creatingV2Project)
  const fundingCycleMetadata = useCreatingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useCreatingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useCreatingV2V3FundAccessConstraintsSelector()

  const dispatch = useAppDispatch()

  const handleDeployFailure = useCallback((error: unknown) => {
    console.error(error)
    emitErrorNotification(`Error deploying project: ${error}`)
    setIsDeploying(false)
    setTransactionPending(false)
  }, [])

  const operationCallbacks = useCallback(
    (onProjectDeployed?: (projectId: number) => void): LaunchTxOpts => ({
      onTransactionPending: () => {
        console.info('Project transaction executed. Await confirmation...')
        setTransactionPending(true)
      },
      onTransactionConfirmed: async (hash, projectId) => {
        // Reset the project state
        dispatch(creatingV2ProjectActions.resetState())
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
      chainId,
      onProjectDeployed,
    }: {
      chainId: JBChainId,
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
      let nftCids: Awaited<ReturnType<typeof uploadNftRewards>> | undefined
      try {
        if (isNftProject) {
          nftCids = await uploadNftRewards()
        }
      } catch (error) {
        handleDeployFailure(error)
        return
      }

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
        let tx
        if (isNftProject) {
          tx = await deployNftProject({
            chainId,
            metadataCid: projectMetadataCid,
            rewardTierCids: nftCids!.rewardTiers,
            nftCollectionMetadataUri: nftCids!.nfCollectionMetadata,
            ...operationCallbacks(onProjectDeployed),
          })
        } else {
          tx = await deployStandardProject({
            chainId,
            metadataCid: projectMetadataCid,
            ...operationCallbacks(onProjectDeployed),
          })
        }
        if (!tx) {
          setIsDeploying(false)
          setTransactionPending(false)
          return
        }
      } catch (error) {
        handleDeployFailure(error)
        return
      }
    },
    [
      deployNftProject,
      deployStandardProject,
      fundAccessConstraints,
      fundingCycleData,
      fundingCycleMetadata,
      handleDeployFailure,
      isNftProject,
      operationCallbacks,
      postPayModal,
      projectMetadata,
      uploadNftRewards,
    ],
  )

  return {
    isDeploying,
    deployTransactionPending: transactionPending,
    deployProject,
  }
}
