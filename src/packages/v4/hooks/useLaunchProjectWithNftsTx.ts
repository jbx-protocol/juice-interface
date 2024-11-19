import { waitForTransactionReceipt } from '@wagmi/core'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { DEFAULT_MEMO, NATIVE_TOKEN } from 'juice-sdk-core'
import {
  useJBContractContext,
  useReadJb721TiersHookStoreTiersOf,
  useWriteJb721TiersHookProjectDeployerLaunchProjectFor,
} from 'juice-sdk-react'
import { isValidMustStartAtOrAfter } from 'packages/v2v3/utils/fundingCycle'
import {
  JBDeploy721TiersHookConfig,
  LaunchProjectWithNftsTxArgs,
} from 'packages/v4/models/nfts'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import {
  Address,
  toBytes,
  toHex,
  WaitForTransactionReceiptReturnType,
  zeroAddress,
} from 'viem'
import {
  LaunchV2V3ProjectArgs,
  transformV2V3CreateArgsToV4,
} from '../utils/launchProjectTransformers'
import { wagmiConfig } from '../wagmiConfig'
import { useCurrentRouteChainId } from './useCurrentRouteChainId'
import {
  getProjectIdFromLaunchReceipt,
  LaunchTxOpts,
  SUPPORTED_JB_CONTROLLER_ADDRESS,
  SUPPORTED_JB_MULTITERMINAL_ADDRESS,
} from './useLaunchProjectTx'
function createSalt() {
  const base: string = '0x' + Math.random().toString(16).slice(2) // idk lol
  const salt = toHex(toBytes(base, { size: 32 }))

  return salt
}

/**
 * The contract addresses to use for deployment
 * @todo not ideal to hardcode these addresses
 */
export const SUPPORTED_JB_721_TIER_STORE = {
  '84532': '0x4DeF0AA5B9CA095d11705284221b2878731ab4EF' as Address,
  '421614': '0x4DeF0AA5B9CA095d11705284221b2878731ab4EF' as Address,
  '11155111': '0x4DeF0AA5B9CA095d11705284221b2878731ab4EF' as Address,
  '11155420': '0x4DeF0AA5B9CA095d11705284221b2878731ab4EF' as Address,
}

/**
 *
 * TODO still wip
 */
export function useLaunchProjectWithNftsTx() {
  const { contracts } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  const { userAddress } = useWallet()
  const chainId = useCurrentRouteChainId()
  const defaultJBController = chainId
    ? SUPPORTED_JB_CONTROLLER_ADDRESS[chainId]
    : undefined

  const defaultJBETHPaymentTerminal = chainId
    ? SUPPORTED_JB_MULTITERMINAL_ADDRESS[chainId]
    : undefined
  const JBTiered721DelegateStoreAddress = chainId
    ? SUPPORTED_JB_721_TIER_STORE[chainId]
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
    const _owner = owner?.length ? owner : userAddress

    const deployTiered721HookData: JBDeploy721TiersHookConfig = {
      name: collectionName,
      symbol: collectionSymbol,
      baseUri: '', // ?
      tokenUriResolver: zeroAddress, // ?
      contractUri: collectionUri, // ?
      tiersConfig: tiers,
      reserveBeneficiary: zeroAddress, //?;
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
      owner,
      deployTiered721HookData, //_deployTiered721HookData
      launchProjectData, // _launchProjectData,
      defaultJBController,
      createSalt(),
    ]

    try {
      // SIMULATE TX: TODO update for nfts
      // const encodedData = encodeFunctionData({
      //   abi: jbControllerAbi, // ABI of the contract
      //   functionName: 'launchProjectFor',
      //   args,
      // })

      const hash = await writeLaunchProject({
        chainId,
        args,
      })

      type x = typeof useReadJb721TiersHookStoreTiersOf

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
  }
}
