import { waitForTransactionReceipt } from '@wagmi/core'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { JBChainId } from 'juice-sdk-react'
import { jb721TiersHookProjectDeployerAbi, JB721HookContracts, jbContractAddress } from 'juice-sdk-core'
import { useWriteContract } from 'wagmi'
import { useNftProjectLaunchData } from 'packages/v4v5/components/Create/hooks/DeployProject/hooks/NFT/useNftProjectLaunchData'
import { wagmiConfig } from 'contexts/Para/Providers'
import { useContext } from 'react'
import { WaitForTransactionReceiptReturnType } from 'viem'
import { LaunchTxOpts } from '../../useLaunchProjectTx'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'

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
  const { addTransaction } = useContext(TxHistoryContext)
  const { writeContractAsync: writeLaunchProject } = useWriteContract()
  const getLaunchData = useNftProjectLaunchData()
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5'

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

      const deployerAddress = jbContractAddress[versionString][JB721HookContracts.JB721TiersHookProjectDeployer][chainId]
      const hash = await writeLaunchProject({
        address: deployerAddress,
        abi: jb721TiersHookProjectDeployerAbi,
        functionName: 'launchProjectFor',
        args,
        chainId: chainId as JBChainId,
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
