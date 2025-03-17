import { waitForTransactionReceipt } from '@wagmi/core'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { jbControllerAbi } from 'juice-sdk-core'
import {
  JBChainId,
  useWriteJbControllerLaunchProjectFor,
} from 'juice-sdk-react'
import { useCallback, useContext } from 'react'
import {
  Address,
  ContractFunctionArgs,
  WaitForTransactionReceiptReturnType,
} from 'viem'
import { useChainId } from 'wagmi'
import { useDeployOmnichainProject } from '../components/Create/hooks/DeployProject/hooks/useDeployOmnichainProject'
import { useStandardProjectLaunchData } from '../components/Create/hooks/DeployProject/hooks/useStandardProjectLaunchData'
import { wagmiConfig } from '../wagmiConfig'

const CREATE_EVENT_IDX = 2
const PROJECT_ID_TOPIC_IDX = 1
const HEX_BASE = 16

export interface LaunchTxOpts {
  onTransactionPending: (hash: `0x${string}`) => void
  onTransactionConfirmed: (hash: `0x${string}`, projectId: number) => void
  onTransactionError: (error: Error) => void
}

/**
 * Return the project ID created from a `launchProjectFor` transaction.
 * @param txReceipt receipt of `launchProjectFor` transaction
 */
export const getProjectIdFromLaunchReceipt = (
  txReceipt: WaitForTransactionReceiptReturnType,
): number => {
  const projectIdHex: string | undefined =
    txReceipt?.logs[CREATE_EVENT_IDX]?.topics?.[PROJECT_ID_TOPIC_IDX]
  if (!projectIdHex) return 0

  const projectId = parseInt(projectIdHex, HEX_BASE)
  return projectId
}

/**
 * Takes data in V2V3 format, converts it to v4 format and passes it to `writeLaunchProject`
 * @returns A function that deploys a project.
 */
export function useLaunchProjectTx() {
  const { addTransaction } = useContext(TxHistoryContext)
  const { writeContractAsync: writeLaunchProject } =
    useWriteJbControllerLaunchProjectFor()
  const deployOmnichainProject = useDeployOmnichainProject()
  const chainId = useChainId()
  const getLaunchData = useStandardProjectLaunchData()

  return useCallback(
    async (
      launchProjectForData: ContractFunctionArgs<
        typeof jbControllerAbi,
        'nonpayable',
        'launchProjectFor'
      >,
      controllerAddress: Address | undefined,
      chainId: JBChainId | undefined,
      {
        onTransactionPending: onTransactionPendingCallback,
        onTransactionConfirmed: onTransactionConfirmedCallback,
        onTransactionError: onTransactionErrorCallback,
      }: LaunchTxOpts,
    ) => {
      if (!chainId || !controllerAddress) {
        throw new Error('Chain ID and controller address are required')
      }

      try {
        // SIMULATE TX:
        // const encodedData = encodeFunctionData({
        //   abi: jbControllerAbi, // ABI of the contract
        //   functionName: 'launchProjectFor',
        //   args,
        // })
        const hash = await writeLaunchProject({
          chainId,
          address: controllerAddress,
          args: launchProjectForData,
        })

        onTransactionPendingCallback(hash)
        addTransaction?.('Launch Project', { hash })
        const transactionReceipt: WaitForTransactionReceiptReturnType =
          await waitForTransactionReceipt(wagmiConfig, {
            hash,
          })

        const newProjectId = getProjectIdFromLaunchReceipt(transactionReceipt)

        onTransactionConfirmedCallback(hash, newProjectId)
      } catch (e) {
        onTransactionErrorCallback(
          (e as Error) ?? new Error('Transaction failed'),
        )
      }
    },
    [
      getLaunchData,
      deployOmnichainProject,
      chainId,
      writeLaunchProject,
      addTransaction,
    ],
  )
}
