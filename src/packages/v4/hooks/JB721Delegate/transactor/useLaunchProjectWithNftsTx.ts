import {
  JBChainId,
  useJBContractContext,
  useWriteJb721TiersHookProjectDeployerLaunchProjectFor,
} from 'juice-sdk-react'
import { WaitForTransactionReceiptReturnType } from 'viem'

import { waitForTransactionReceipt } from '@wagmi/core'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { useNftProjectLaunchData } from 'packages/v4/components/Create/hooks/DeployProject/hooks/NFT/useNftProjectLaunchData'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useContext } from 'react'
import { LaunchTxOpts } from '../../useLaunchProjectTx'

/**
 * Return the project ID created from a `launchProjectFor` transaction.
 * @param txReceipt receipt of `launchProjectFor` transaction
 */
export const getProjectIdFromNftLaunchReceipt = (
  txReceipt: WaitForTransactionReceiptReturnType,
): number => {
  const projectIdHex: string | undefined = txReceipt?.logs[0]?.topics?.[1]
  if (!projectIdHex) return 0

  const projectId = parseInt(projectIdHex, 16)
  return projectId
}

export function useLaunchProjectWithNftsTx() {
  const { contracts } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  const { userAddress } = useWallet()

  const { writeContractAsync: writeLaunchProject } =
    useWriteJb721TiersHookProjectDeployerLaunchProjectFor()
  const getLaunchData = useNftProjectLaunchData()

  return async (
    chainId: JBChainId,
    {
      projectMetadataCID,
      nftCollectionMetadataUri,
      rewardTierCids,
    }: {
      projectMetadataCID: string
      nftCollectionMetadataUri: string
      rewardTierCids: string[]
    },
    {
      onTransactionPending: onTransactionPendingCallback,
      onTransactionConfirmed: onTransactionConfirmedCallback,
      onTransactionError: onTransactionErrorCallback,
    }: LaunchTxOpts,
  ) => {
    const { args } = getLaunchData({
      projectMetadataCID,
      nftCollectionMetadataUri,
      rewardTierCids,
      chainId: chainId as JBChainId,
    })

    try {
      // SIMULATE TX: TODO update for nfts
      // const encodedData = encodeFunctionData({
      //   abi: jbControllerAbi, // ABI of the contract
      //   functionName: 'launchProjectFor',
      //   args,
      // })

      const hash = await writeLaunchProject({
        chainId: chainId as JBChainId,
        args,
      })

      onTransactionPendingCallback(hash)
      addTransaction?.('Launch Project', { hash, chainId })
      const transactionReceipt: WaitForTransactionReceiptReturnType =
        await waitForTransactionReceipt(wagmiConfig, {
          hash,
          chainId,
        })

      const newProjectId = getProjectIdFromNftLaunchReceipt(transactionReceipt)

      onTransactionConfirmedCallback(hash, newProjectId)

      return false
    } catch (e) {
      onTransactionErrorCallback(
        (e as Error) ?? new Error('Transaction failed'),
      )
      return true
    }
  }
}
