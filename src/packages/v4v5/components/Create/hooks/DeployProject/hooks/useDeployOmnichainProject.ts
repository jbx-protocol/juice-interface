import {
  createSalt,
  jb721TiersHookProjectDeployerAbi,
  JBChainId,
  jbContractAddress,
  jbController4_1Abi,
  JBCoreContracts,
  jbOmnichainDeployer4_1Abi,
  JBOmnichainDeployerContracts,
  parseSuckerDeployerConfig,
} from 'juice-sdk-core'
import {
  useGetRelayrTxBundle,
  useGetRelayrTxQuote,
  useSendRelayrTx,
} from 'juice-sdk-react'
import { ContractFunctionArgs, encodeFunctionData } from 'viem'

import { useWallet } from 'hooks/Wallet'
import { estimateContractGasWithFallback, OMNICHAIN_GAS_FALLBACKS } from 'packages/v4v5/utils/estimateOmnichainGas'

export function useDeployOmnichainProject() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()

  async function deployOmnichainProject(
    deployData: {
      [k in JBChainId]?: ContractFunctionArgs<
        typeof jbController4_1Abi,
        'nonpayable',
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
        const suckerDeploymentConfiguration = parseSuckerDeployerConfig(
          chainId,
          chainIds,
        )

        const chainDeployData = deployData[chainId]
        if (!chainDeployData) {
          throw new Error('No deploy data for chain: ' + chainId)
        }

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
        const args = [...baseArgs, controllerAddress as `0x${string}`] as const

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
        'nonpayable',
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
        const suckerDeploymentConfiguration = parseSuckerDeployerConfig(
          chainId,
          chainIds,
        )

        const chainDeployData = deployData[chainId]
        if (!chainDeployData) {
          throw new Error('No deploy data for chain: ' + chainId)
        }

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
        ] as const

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
