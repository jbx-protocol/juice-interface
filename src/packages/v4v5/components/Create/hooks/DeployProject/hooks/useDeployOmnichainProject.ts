import {
  createSalt,
  JB721HookContracts,
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

    const relayrTransactions = chainIds.map(chainId => {
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
      const encodedData = encodeFunctionData({
        abi: jbOmnichainDeployer4_1Abi, // ABI of the contract
        functionName: 'launchProjectFor',
        args: [...args, controllerAddress as `0x${string}`],
      })


      // Always use v5 JBOmnichainDeployer
      const omnichainDeployerAddress = jbContractAddress['5'][
        JBOmnichainDeployerContracts.JBOmnichainDeployer
      ][chainId]
      return {
        data: {
          from: userAddress,
          to: omnichainDeployerAddress as `0x${string}`,
          value: 0n,
          gas: 1_000_000n * BigInt(chainIds.length),
          data: encodedData,
        },
        chainId,
      }
    })

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

    const relayrTransactions = chainIds.map(chainId => {
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
        jbContractAddress['5'][JBCoreContracts.JBController][chainId] as `0x${string}`, // all chains use the same controller
      ] as const

      const encodedData = encodeFunctionData({
        abi: jbOmnichainDeployer4_1Abi, // ABI of the contract
        functionName: 'launch721ProjectFor',
        args,
      })


      // Always use v5 JBOmnichainDeployer
      const omnichainDeployerAddress = jbContractAddress['5'][
        JBOmnichainDeployerContracts.JBOmnichainDeployer
      ][chainId]
      return {
        data: {
          from: userAddress,
          to: omnichainDeployerAddress as `0x${string}`,
          value: 0n,
          gas: 3_000_000n * BigInt(chainIds.length), // Bigger mutliple for NFTS. TODO ba5sed might have a better suggestion here.
          data: encodedData,
        },
        chainId,
      }
    })

    return await getRelayrTxQuote(relayrTransactions)
  }

  return {
    deployOmnichainProject,
    deployOmnichainNftProject,
    sendRelayrTx,
    relayrBundle,
  }
}
