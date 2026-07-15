import {
  createSalt,
  jb721TiersHookProjectDeployerAbi,
  JBChainId,
  jbContractAddress,
  jbControllerAbi,
  JBCoreContracts,
  jbOmnichainDeployer4_1Abi,
  jbOmnichainDeployerAbi,
  JBOmnichainDeployerContracts,
  jbProjectsAbi,
  MappableAsset,
  parseSuckerDeployerConfig,
} from '@bananapus/nana-sdk-core'
import {
  useGetRelayrTxBundle,
  useGetRelayrTxQuote,
  useSendRelayrTx,
} from '@bananapus/nana-sdk-react'
import { readContract } from '@wagmi/core'
import {
  Address,
  Chain,
  Client,
  ContractFunctionArgs,
  encodeFunctionData,
  PublicClient,
  Transport,
} from 'viem'
import { estimateGas } from 'viem/actions'

import { wagmiConfig } from 'contexts/Para/Providers'
import { useWallet } from 'hooks/Wallet'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { estimateContractGasWithFallback, OMNICHAIN_GAS_FALLBACKS } from 'packages/v4v5/utils/estimateOmnichainGas'

const GAS_BUFFER_PERCENT = 120n // 20% buffer

// v6: sucker deployer configs use bytes32 peer/remoteToken.
type V6SuckerDeployerConfigurations = {
  deployer: `0x${string}`
  peer: `0x${string}`
  mappings: {
    localToken: `0x${string}`
    minGas: number
    remoteToken: `0x${string}`
  }[]
}[]

/**
 * Estimates gas for a payable call (the shared helper doesn't send value, so v6
 * launches - which require msg.value == creationFee - would always revert).
 * Falls back if estimation fails, e.g. the wallet doesn't hold the fee on this
 * chain; Relayr re-simulates server-side.
 */
async function estimatePayableGasWithFallback({
  chainId,
  to,
  data,
  value,
  userAddress,
  fallbackGas,
}: {
  chainId: JBChainId
  to: Address
  data: `0x${string}`
  value: bigint
  userAddress: Address
  fallbackGas: bigint
}): Promise<bigint> {
  try {
    const client = wagmiConfig.getClient({ chainId }) as Client<Transport, Chain>

    const gasEstimate = await estimateGas(client as PublicClient, {
      to,
      data,
      account: userAddress,
      value,
    })

    return (gasEstimate * GAS_BUFFER_PERCENT) / 100n
  } catch {
    return fallbackGas
  }
}

export function useDeployOmnichainProject() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()
  const { version } = useV4V5Version()

  async function deployOmnichainProject(
    deployData: {
      [k in JBChainId]?: ContractFunctionArgs<
        typeof jbControllerAbi,
        'payable',
        'launchProjectFor'
      >
    },
    chainIds: JBChainId[],
  ) {
    if (!userAddress) {
      return
    }
    const salt = createSalt()

    const relayrTransactions = await Promise.all(
      chainIds.map(async chainId => {
        const chainDeployData = deployData[chainId]
        if (!chainDeployData) {
          throw new Error('No deploy data for chain: ' + chainId)
        }

        if (version === 6) {
          const suckerDeploymentConfiguration = parseSuckerDeployerConfig(
            chainId,
            chainIds,
            [MappableAsset.NATIVE],
            { version: 6 },
          )

          const args = [
            chainDeployData[0],
            chainDeployData[1],
            chainDeployData[2],
            chainDeployData[3],
            chainDeployData[4],
            {
              deployerConfigurations:
                suckerDeploymentConfiguration.deployerConfigurations as V6SuckerDeployerConfigurations,
              salt,
            },
          ] as const

          const omnichainDeployerAddress = jbContractAddress['6'][
            JBOmnichainDeployerContracts.JBOmnichainDeployer
          ][chainId]

          const encodedData = encodeFunctionData({
            abi: jbOmnichainDeployerAbi,
            functionName: 'launchProjectFor',
            args,
          })

          // v6: the launch is payable and requires msg.value == JBProjects.creationFee() exactly.
          const creationFee = await readContract(wagmiConfig, {
            address: jbContractAddress['6'][JBCoreContracts.JBProjects][chainId],
            abi: jbProjectsAbi,
            functionName: 'creationFee',
            chainId,
          })

          const gas = await estimatePayableGasWithFallback({
            chainId,
            to: omnichainDeployerAddress,
            data: encodedData,
            value: creationFee,
            userAddress,
            fallbackGas: OMNICHAIN_GAS_FALLBACKS.LAUNCH_PROJECT,
          })

          return {
            data: {
              from: userAddress,
              to: omnichainDeployerAddress,
              value: creationFee,
              gas,
              data: encodedData,
            },
            chainId,
            version: 6 as const,
          }
        }

        const suckerDeploymentConfiguration = parseSuckerDeployerConfig(
          chainId,
          chainIds,
        )

        const baseArgs = [
          chainDeployData[0],
          chainDeployData[1],
          chainDeployData[2],
          chainDeployData[3],
          chainDeployData[4],
          {
            deployerConfigurations:
              suckerDeploymentConfiguration.deployerConfigurations,
            salt,
          },
        ] as const

        // Always use v5 JBController
        const controllerAddress = jbContractAddress['5'][JBCoreContracts.JBController][chainId]
        // The launch data carries both the v5 and v6 metadata key spellings, so it
        // encodes correctly under the v5 ABI too.
        const args = [...baseArgs, controllerAddress as `0x${string}`] as unknown as ContractFunctionArgs<
          typeof jbOmnichainDeployer4_1Abi,
          'nonpayable',
          'launchProjectFor'
        >

        // Always use v5 JBOmnichainDeployer
        const omnichainDeployerAddress = jbContractAddress['5'][
          JBOmnichainDeployerContracts.JBOmnichainDeployer
        ][chainId] as `0x${string}`

        const gas = await estimateContractGasWithFallback({
          chainId,
          contractAddress: omnichainDeployerAddress,
          abi: jbOmnichainDeployer4_1Abi,
          functionName: 'launchProjectFor',
          args,
          userAddress,
          fallbackGas: OMNICHAIN_GAS_FALLBACKS.LAUNCH_PROJECT,
        })

        const encodedData = encodeFunctionData({
          abi: jbOmnichainDeployer4_1Abi,
          functionName: 'launchProjectFor',
          args,
        })

        return {
          data: {
            from: userAddress,
            to: omnichainDeployerAddress,
            value: 0n,
            gas,
            data: encodedData,
          },
          chainId,
        }
      })
    )

    return await getRelayrTxQuote(relayrTransactions)
  }

  async function deployOmnichainNftProject(
    deployData: {
      [k in JBChainId]?: ContractFunctionArgs<
        typeof jb721TiersHookProjectDeployerAbi,
        'payable',
        'launchProjectFor'
      >
    },
    chainIds: JBChainId[],
  ) {
    if (!userAddress) {
      return
    }

    const salt = createSalt()

    const relayrTransactions = await Promise.all(
      chainIds.map(async chainId => {
        const chainDeployData = deployData[chainId]
        if (!chainDeployData) {
          throw new Error('No deploy data for chain: ' + chainId)
        }

        if (version === 6) {
          const suckerDeploymentConfiguration = parseSuckerDeployerConfig(
            chainId,
            chainIds,
            [MappableAsset.NATIVE],
            { version: 6 },
          )

          // v6: JBOmnichainDeployer takes a single payable launchProjectFor overload with
          // the 721 config unpacked alongside the project config (no separate
          // launch721ProjectFor, no controller arg).
          const [owner, deployTiersHookConfig, launchProjectConfig] =
            chainDeployData

          const args = [
            owner,
            launchProjectConfig.projectUri,
            {
              deployTiersHookConfig,
              useDataHookForCashOut:
                launchProjectConfig.rulesetConfigurations[0]?.metadata
                  .useDataHookForCashOut ?? false,
              salt,
            },
            // The 721 deployer type strips useDataHookForPay/dataHook from the ruleset
            // metadata, but the omnichain overload (and the runtime objects, which come
            // from the standard transformer) carry the full metadata.
            launchProjectConfig.rulesetConfigurations as unknown as ContractFunctionArgs<
              typeof jbControllerAbi,
              'payable',
              'launchProjectFor'
            >[2],
            launchProjectConfig.terminalConfigurations,
            launchProjectConfig.memo,
            {
              deployerConfigurations:
                suckerDeploymentConfiguration.deployerConfigurations as V6SuckerDeployerConfigurations,
              salt,
            },
          ] as const

          const omnichainDeployerAddress = jbContractAddress['6'][
            JBOmnichainDeployerContracts.JBOmnichainDeployer
          ][chainId]

          const encodedData = encodeFunctionData({
            abi: jbOmnichainDeployerAbi,
            functionName: 'launchProjectFor',
            args,
          })

          // v6: the launch is payable and requires msg.value == JBProjects.creationFee() exactly.
          const creationFee = await readContract(wagmiConfig, {
            address: jbContractAddress['6'][JBCoreContracts.JBProjects][chainId],
            abi: jbProjectsAbi,
            functionName: 'creationFee',
            chainId,
          })

          const gas = await estimatePayableGasWithFallback({
            chainId,
            to: omnichainDeployerAddress,
            data: encodedData,
            value: creationFee,
            userAddress,
            fallbackGas: OMNICHAIN_GAS_FALLBACKS.LAUNCH_NFT_PROJECT,
          })

          return {
            data: {
              from: userAddress,
              to: omnichainDeployerAddress,
              value: creationFee,
              gas,
              data: encodedData,
            },
            chainId,
            version: 6 as const,
          }
        }

        const suckerDeploymentConfiguration = parseSuckerDeployerConfig(
          chainId,
          chainIds,
        )

        // The launch data carries both the v5 and v6 721 config key spellings, so it
        // encodes correctly under the v5 ABI too.
        const args = [
          chainDeployData[0],
          chainDeployData[1],
          chainDeployData[2],
          salt,
          {
            deployerConfigurations:
              suckerDeploymentConfiguration.deployerConfigurations,
            salt,
          },
          jbContractAddress['5'][JBCoreContracts.JBController][chainId] as `0x${string}`,
        ] as unknown as ContractFunctionArgs<
          typeof jbOmnichainDeployer4_1Abi,
          'nonpayable',
          'launch721ProjectFor'
        >

        // Always use v5 JBOmnichainDeployer
        const omnichainDeployerAddress = jbContractAddress['5'][
          JBOmnichainDeployerContracts.JBOmnichainDeployer
        ][chainId] as `0x${string}`

        const gas = await estimateContractGasWithFallback({
          chainId,
          contractAddress: omnichainDeployerAddress,
          abi: jbOmnichainDeployer4_1Abi,
          functionName: 'launch721ProjectFor',
          args,
          userAddress,
          fallbackGas: OMNICHAIN_GAS_FALLBACKS.LAUNCH_NFT_PROJECT,
        })

        const encodedData = encodeFunctionData({
          abi: jbOmnichainDeployer4_1Abi,
          functionName: 'launch721ProjectFor',
          args,
        })

        return {
          data: {
            from: userAddress,
            to: omnichainDeployerAddress,
            value: 0n,
            gas,
            data: encodedData,
          },
          chainId,
        }
      })
    )

    return await getRelayrTxQuote(relayrTransactions)
  }

  return {
    deployOmnichainProject,
    deployOmnichainNftProject,
    sendRelayrTx,
    relayrBundle,
  }
}
