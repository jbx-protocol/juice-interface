import { waitForTransactionReceipt } from '@wagmi/core'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { NATIVE_TOKEN } from 'juice-sdk-core'
import { useWriteJbControllerLaunchProjectFor } from 'juice-sdk-react'
import { LaunchV2V3ProjectData } from 'packages/v2v3/hooks/transactor/useLaunchProjectTx'
import { useCallback, useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { Address, WaitForTransactionReceiptReturnType } from 'viem'
import { sepolia } from 'viem/chains'
import {
  LaunchV2V3ProjectArgs,
  transformV2V3CreateArgsToV4,
} from '../utils/launchProject'
import { wagmiConfig } from '../wagmiConfig'
import { useCurrentRouteChainId } from './useCurrentRouteChainId'

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
const getProjectIdFromLaunchReceipt = (
  txReceipt: WaitForTransactionReceiptReturnType,
): number => {
  const projectIdHex: string | undefined =
    txReceipt?.logs[CREATE_EVENT_IDX]?.topics?.[PROJECT_ID_TOPIC_IDX]
  if (!projectIdHex) return 0

  const projectId = parseInt(projectIdHex, HEX_BASE)
  return projectId
}

/**
 * The contract addresses to use for deployment
 * @todo not ideal to hardcode these addresses
 */
const SUPPORTED_JB_MULTITERMINAL_ADDRESS = {
  '84532': '0x4DeF0AA5B9CA095d11705284221b2878731ab4EF' as Address,
  '421614': '0x4DeF0AA5B9CA095d11705284221b2878731ab4EF' as Address,
  '11155111': '0x4DeF0AA5B9CA095d11705284221b2878731ab4EF' as Address,
  '11155420': '0x4DeF0AA5B9CA095d11705284221b2878731ab4EF' as Address,
}

const SUPPORTED_JB_CONTROLLER_ADDRESS = {
  '84532': '0x219A5cE6d1c512D5b050ad2E3d380b8746BE0Cb8' as Address,
  '421614': '0x219A5cE6d1c512D5b050ad2E3d380b8746BE0Cb8' as Address,
  '11155111': '0x219A5cE6d1c512D5b050ad2E3d380b8746BE0Cb8' as Address,
  '11155420': '0x219A5cE6d1c512D5b050ad2E3d380b8746BE0Cb8' as Address,
}

/**
 * Takes data in V2V3 format, converts it to v4 format and passes it to `writeLaunchProject`
 * @returns A function that deploys a project.
 */
export function useLaunchProjectTx() {
  const { writeContractAsync: writeLaunchProject } =
    useWriteJbControllerLaunchProjectFor()

  const chainId = useCurrentRouteChainId() ?? sepolia.id // default to sepolia
  const terminalAddress = chainId
    ? SUPPORTED_JB_MULTITERMINAL_ADDRESS[chainId]
    : undefined

  const controllerAddress = chainId
    ? SUPPORTED_JB_CONTROLLER_ADDRESS[chainId]
    : undefined

  const { addTransaction } = useContext(TxHistoryContext)

  const { userAddress } = useWallet()

  return useCallback(
    async (
      {
        owner,
        projectMetadataCID,
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints,
        groupedSplits = [],
        mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
      }: LaunchV2V3ProjectData,
      {
        onTransactionPending: onTransactionPendingCallback,
        onTransactionConfirmed: onTransactionConfirmedCallback,
        onTransactionError: onTransactionErrorCallback,
      }: LaunchTxOpts,
    ) => {
      if (!controllerAddress || !terminalAddress || !userAddress || !chainId) {
        return
      }

      const _owner = owner && owner.length ? owner : userAddress

      const v2v3Args = [
        _owner,
        [projectMetadataCID, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN],
        fundingCycleData,
        fundingCycleMetadata,
        mustStartAtOrAfter,
        groupedSplits,
        fundAccessConstraints,
        [terminalAddress], // _terminals, just supporting single for now
        // Eventually should be something like:
        //    getTerminalsFromFundAccessConstraints(
        //      fundAccessConstraints,
        //      contracts.primaryNativeTerminal.data,
        //    ),
        DEFAULT_MEMO,
      ] as LaunchV2V3ProjectArgs

      const args = transformV2V3CreateArgsToV4({
        v2v3Args,
        primaryNativeTerminal: terminalAddress,
        currencyTokenAddress: NATIVE_TOKEN,
      })

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
          args,
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
      chainId,
      controllerAddress,
      userAddress,
      writeLaunchProject,
      terminalAddress,
      addTransaction,
    ],
  )
}
