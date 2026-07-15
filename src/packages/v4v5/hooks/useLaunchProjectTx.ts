import { JBChainId } from '@bananapus/nana-sdk-react'
import { useCallback, useContext } from 'react'
import {
  Address,
  ContractFunctionArgs,
  WaitForTransactionReceiptReturnType,
} from 'viem'
import { useWriteContract } from 'wagmi'

import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from 'contexts/Para/Providers'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import {
  jbContractAddress,
  jbControllerAbi,
  jbControllerV5Abi,
  JBCoreContracts,
  jbProjectsAbi,
} from '@bananapus/nana-sdk-core'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

const CREATE_EVENT_IDX = 2
const OMNICHAIN_721_CREATE_EVENT_IDX = 10
const PROJECT_ID_TOPIC_IDX = 1
const OMNICHAIN_721_PROJECT_ID_TOPIC_IDX = 2
const HEX_BASE = 16

// keccak256('Transfer(address,address,uint256)')
const ERC721_TRANSFER_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const ZERO_TOPIC =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

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
  // The project NFT mint (an ERC-721 Transfer from the zero address, i.e. 4 topics with a
  // zero `from`) is the only such log in a launch receipt and holds the project ID as its
  // tokenId — position-independent, so it survives per-version differences in log ordering.
  const mintLog = txReceipt?.logs?.find(
    log =>
      log.topics?.[0] === ERC721_TRANSFER_TOPIC &&
      log.topics.length === 4 &&
      log.topics[1] === ZERO_TOPIC,
  )
  if (mintLog?.topics?.[3]) {
    return parseInt(mintLog.topics[3], HEX_BASE)
  }

  // Fallback: legacy fixed log positions.
  const eventIdx = omnichain721
    ? OMNICHAIN_721_CREATE_EVENT_IDX
    : CREATE_EVENT_IDX
  const topicIdx = omnichain721
    ? OMNICHAIN_721_PROJECT_ID_TOPIC_IDX
    : PROJECT_ID_TOPIC_IDX

  const launchProjectLog = txReceipt?.logs?.[eventIdx]
  const projectIdHex: string | undefined = launchProjectLog?.topics?.[topicIdx]

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
  const { writeContractAsync: writeLaunchProject } = useWriteContract()
  const { version } = useV4V5Version()

  return useCallback(
    async (
      launchProjectForData: ContractFunctionArgs<
        typeof jbControllerAbi,
        'payable',
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
        let hash: `0x${string}`
        if (version === 6) {
          // v6: launchProjectFor is payable and reverts unless
          // msg.value == JBProjects.creationFee() exactly.
          const creationFee = await readContract(wagmiConfig, {
            address: jbContractAddress['6'][JBCoreContracts.JBProjects][chainId],
            abi: jbProjectsAbi,
            functionName: 'creationFee',
            chainId,
          })

          hash = await writeLaunchProject({
            address: controllerAddress,
            abi: jbControllerAbi,
            functionName: 'launchProjectFor',
            args: launchProjectForData,
            chainId,
            value: creationFee,
          })
        } else {
          // v4/v5 launches are nonpayable. The transformer emits both the v5 and v6
          // metadata key spellings, so the same args encode correctly under either ABI.
          hash = await writeLaunchProject({
            address: controllerAddress,
            abi: jbControllerV5Abi,
            functionName: 'launchProjectFor',
            args: launchProjectForData as unknown as ContractFunctionArgs<
              typeof jbControllerV5Abi,
              'nonpayable',
              'launchProjectFor'
            >,
            chainId,
          })
        }

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
    [writeLaunchProject, addTransaction, version],
  )
}
