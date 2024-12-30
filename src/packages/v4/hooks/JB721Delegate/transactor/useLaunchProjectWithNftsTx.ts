import { waitForTransactionReceipt } from '@wagmi/core'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import {
  DEFAULT_MEMO,
  jbProjectDeploymentAddresses,
  NATIVE_TOKEN,
  NATIVE_TOKEN_DECIMALS,
} from 'juice-sdk-core'
import {
  JBChainId,
  jbPricesAddress,
  useJBContractContext,
  useWriteJb721TiersHookProjectDeployerLaunchProjectFor,
} from 'juice-sdk-react'
import { isValidMustStartAtOrAfter } from 'packages/v2v3/utils/fundingCycle'
import {
  JBDeploy721TiersHookConfig,
  LaunchProjectWithNftsTxArgs,
} from 'packages/v4/models/nfts'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/v2v3/shared/v2ProjectDefaultState'
import { ipfsUri } from 'utils/ipfs'
import {
  Address,
  toBytes,
  toHex,
  WaitForTransactionReceiptReturnType,
  zeroAddress,
} from 'viem'
import { useChainId } from 'wagmi'
import {
  LaunchV2V3ProjectArgs,
  transformV2V3CreateArgsToV4,
} from '../../../utils/launchProjectTransformers'
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
  const chainId = useChainId()

  const defaultJBController = chainId
    ? (jbProjectDeploymentAddresses.JBController[
        chainId as JBChainId
      ] as Address)
    : undefined
  const defaultJBETHPaymentTerminal = chainId
    ? (jbProjectDeploymentAddresses.JBMultiTerminal[
        chainId as JBChainId
      ] as Address)
    : undefined
  const JBTiered721DelegateStoreAddress = chainId
    ? (jbProjectDeploymentAddresses.JB721TiersHookStore[
        chainId as JBChainId
      ] as Address)
    : undefined

  const { writeContractAsync: writeLaunchProject } =
    useWriteJb721TiersHookProjectDeployerLaunchProjectFor()

  return async (
    {
      tiered721DelegateData: {
        collectionUri,
        collectionName,
        collectionSymbol,
        currency,
        tiers,
        flags,
      },
      projectData: {
        projectMetadataCID,
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints,
        groupedSplits = [],
        mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
        owner,
      },
    }: LaunchProjectWithNftsTxArgs,
    {
      onTransactionPending: onTransactionPendingCallback,
      onTransactionConfirmed: onTransactionConfirmedCallback,
      onTransactionError: onTransactionErrorCallback,
    }: LaunchTxOpts,
  ) => {
    if (
      !userAddress ||
      !contracts ||
      !defaultJBController ||
      !defaultJBETHPaymentTerminal ||
      !JBTiered721DelegateStoreAddress ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      const missingParam = !userAddress
        ? 'userAddress'
        : !contracts
        ? 'contracts'
        : !defaultJBController
        ? 'defaultJBController'
        : !JBTiered721DelegateStoreAddress
        ? 'JBTiered721DelegateProjectDeployer'
        : null

      onTransactionErrorCallback?.(
        new DOMException(
          `Transaction failed, missing argument "${
            missingParam ?? '<unknown>'
          }".`,
        ),
      )

      return Promise.resolve(false)
    }
    const _owner = (owner?.length ? owner : userAddress) as Address

    const deployTiered721HookData: JBDeploy721TiersHookConfig = {
      name: collectionName,
      symbol: collectionSymbol,
      baseUri: ipfsUri(''),
      tokenUriResolver: zeroAddress,
      contractUri: ipfsUri(collectionUri),
      tiersConfig: {
        currency,
        decimals: NATIVE_TOKEN_DECIMALS,
        prices: jbPricesAddress[chainId as JBChainId],
        tiers,
      },
      reserveBeneficiary: zeroAddress,
      flags,
    }

    const v2v3LaunchProjectArgs = [
      _owner,
      [projectMetadataCID, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN],
      fundingCycleData,
      fundingCycleMetadata,
      mustStartAtOrAfter,
      groupedSplits,
      fundAccessConstraints,
      [defaultJBETHPaymentTerminal], // _terminals, just supporting single for now
      // Eventually should be something like:
      //    getTerminalsFromFundAccessConstraints(
      //      fundAccessConstraints,
      //      contracts.primaryNativeTerminal.data,
      //    ),
      DEFAULT_MEMO,
    ] as LaunchV2V3ProjectArgs
    const launchProjectData = transformV2V3CreateArgsToV4({
      v2v3Args: v2v3LaunchProjectArgs,
      primaryNativeTerminal: defaultJBETHPaymentTerminal,
      currencyTokenAddress: NATIVE_TOKEN,
    })

    const args = [
      _owner,
      deployTiered721HookData, //_deployTiered721HookData
      {
        projectUri: launchProjectData[1],
        rulesetConfigurations: launchProjectData[2],
        terminalConfigurations: launchProjectData[3],
        memo: launchProjectData[4],
      }, // _launchProjectData,
      defaultJBController,
      createSalt(),
    ] as const

    try {
      // SIMULATE TX: TODO update for nfts
      // const encodedData = encodeFunctionData({
      //   abi: jbControllerAbi, // ABI of the contract
      //   functionName: 'launchProjectFor',
      //   args,
      // })

      const hash = await writeLaunchProject({
        chainId: chainId as 84532 | 421614 | 11155111 | 11155420, // TODO: cleanup
        args,
      })

      onTransactionPendingCallback(hash)
      addTransaction?.('Launch Project', { hash })
      const transactionReceipt: WaitForTransactionReceiptReturnType =
        await waitForTransactionReceipt(wagmiConfig, {
          hash,
        })

      const newProjectId = getProjectIdFromNftLaunchReceipt(transactionReceipt)

      onTransactionConfirmedCallback(hash, newProjectId)
    } catch (e) {
      onTransactionErrorCallback(
        (e as Error) ?? new Error('Transaction failed'),
      )
    }
  }
}

function createSalt() {
  const base: string = '0x' + Math.random().toString(16).slice(2) // idk lol
  const salt = toHex(toBytes(base, { size: 32 }))

  return salt
}
