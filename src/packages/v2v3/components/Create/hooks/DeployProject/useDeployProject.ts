import { BigNumber } from '@ethersproject/bignumber'
import * as providers from '@ethersproject/providers'
import { readProvider } from 'constants/readProvider'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { TransactionCallbacks } from 'models/transaction'
import { useCallback, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
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

const CREATE_EVENT_IDX = 2
const NFT_CREATE_EVENT_IDX = 3
const PROJECT_ID_TOPIC_IDX = 1

const JUICEBOX_DOMAIN = 'juicebox'
const JUICECROWD_DOMAIN = 'juicecrowd'

/**
 * Return the project ID created from a `launchProjectFor` transaction.
 * @param txReceipt receipt of `launchProjectFor` transaction
 */
const getProjectIdFromNftLaunchReceipt = (
  txReceipt: providers.TransactionReceipt,
): number => {
  const projectIdHex: unknown | undefined =
    txReceipt?.logs[NFT_CREATE_EVENT_IDX]?.topics?.[PROJECT_ID_TOPIC_IDX]
  const projectId = BigNumber.from(projectIdHex).toNumber()

  return projectId
}

/**
 * Return the project ID created from a `launchProjectFor` transaction.
 * @param txReceipt receipt of `launchProjectFor` transaction
 */
const getProjectIdFromLaunchReceipt = (
  txReceipt: providers.TransactionReceipt,
): number => {
  const projectIdHex: unknown | undefined =
    txReceipt?.logs[CREATE_EVENT_IDX]?.topics?.[PROJECT_ID_TOPIC_IDX]
  const projectId = BigNumber.from(projectIdHex).toNumber()

  return projectId
}

/**
 * Attempt to find the transaction receipt from a transaction hash.

 * Will retry up to 5 times with a 2 second delay between each attempt. If no
 * receipt is not found after 5 attempts, undefined is returned.
 * 
 * @param txHash transaction hash
 * @returns transaction receipt or undefined
 */
const findTransactionReceipt = async (txHash: string) => {
  let retries = 5
  let receipt
  while (retries > 0 && !receipt) {
    receipt = await readProvider.getTransactionReceipt(txHash)
    if (receipt) break

    retries -= 1
    // wait 2s
    await new Promise(r => setTimeout(r, 2000))
    console.info('Retrying tx receipt lookup...')
  }

  return receipt
}

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
    (
      onProjectDeployed?: (projectId: number) => void,
    ): Pick<
      TransactionCallbacks,
      'onCancelled' | 'onConfirmed' | 'onDone' | 'onError'
    > => ({
      onDone: () => {
        console.info('Project transaction executed. Await confirmation...')
        setTransactionPending(true)
      },
      onConfirmed: async result => {
        const hash = result?.hash
        if (!hash) {
          return // TODO error notification
        }
        const txReceipt = await findTransactionReceipt(hash)
        if (!txReceipt) {
          return // TODO error notification
        }

        const projectId = isNftProject
          ? getProjectIdFromNftLaunchReceipt(txReceipt)
          : getProjectIdFromLaunchReceipt(txReceipt)

        if (projectId === undefined) {
          return // TODO error notification
        }

        // Reset the project state
        dispatch(creatingV2ProjectActions.resetState())
        onProjectDeployed?.(projectId)
      },
      onError: error => {
        console.error(error)
        emitErrorNotification(`Error deploying project: ${error}`)
      },
      onCancelled: () => {
        setIsDeploying(false)
        setTransactionPending(false)
      },
    }),
    [dispatch, isNftProject],
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
            metadataCid: projectMetadataCid,
            rewardTierCids: nftCids!.rewardTiers,
            nftCollectionMetadataUri: nftCids!.nfCollectionMetadata,
            ...operationCallbacks(onProjectDeployed),
          })
        } else {
          tx = await deployStandardProject({
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
