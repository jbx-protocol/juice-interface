import {
  Address,
  ContractFunctionArgs,
  WaitForTransactionReceiptReturnType,
} from 'viem'
import {
  JBChainId,
  useWriteJbController4_1LaunchProjectFor,
} from 'juice-sdk-react'
import { useCallback, useContext } from 'react'

import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { jbController4_1Abi } from 'juice-sdk-core'
import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from 'contexts/Para/Providers'

const CREATE_EVENT_IDX = 2
const OMNICHAIN_721_CREATE_EVENT_IDX = 10
const PROJECT_ID_TOPIC_IDX = 1
const OMNICHAIN_721_PROJECT_ID_TOPIC_IDX = 2
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
  {
    omnichain721 = false,
  }: {
    omnichain721?: boolean
  } = {},
): number => {
  const launchProjectLog =
    txReceipt?.logs[
      omnichain721 ? OMNICHAIN_721_CREATE_EVENT_IDX : CREATE_EVENT_IDX
    ]

  const projectIdHex: string | undefined =
    launchProjectLog?.topics?.[
      omnichain721 ? OMNICHAIN_721_PROJECT_ID_TOPIC_IDX : PROJECT_ID_TOPIC_IDX
    ]

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
    useWriteJbController4_1LaunchProjectFor()

  return useCallback(
    async (
      launchProjectForData: ContractFunctionArgs<
        typeof jbController4_1Abi,
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
          address: controllerAddress,
          args: launchProjectForData,
        })

        onTransactionPendingCallback(hash)
        addTransaction?.('Launch Project', { hash, chainId })
        const transactionReceipt: WaitForTransactionReceiptReturnType =
          await waitForTransactionReceipt(wagmiConfig, {
            hash,
            chainId,
          })

        const newProjectId = getProjectIdFromLaunchReceipt(transactionReceipt)

        onTransactionConfirmedCallback(hash, newProjectId)
        return false
      } catch (e) {
        onTransactionErrorCallback(
          (e as Error) ?? new Error('Transaction failed'),
        )
        return true
      }
    },
    [writeLaunchProject, addTransaction],
  )
}
