import { ContractFunctionArgs, encodeFunctionData } from 'viem'
import {
  JBChainId,
  createSalt,
  jbController4_1Abi,
  jb721TiersHookProjectDeployerAbi,
  jbOmnichainDeployer4_1Abi,
  jbContractAddress,
  JBCoreContracts,
  JB721HookContracts,
  JBOmnichainDeployerContracts,
  parseSuckerDeployerConfig
} from 'juice-sdk-core'
import {
  useGetRelayrTxBundle,
  useGetRelayrTxQuote,
  useSendRelayrTx,
} from 'juice-sdk-react'

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

      const encodedData = encodeFunctionData({
        abi: jbOmnichainDeployer4_1Abi, // ABI of the contract
        functionName: 'launchProjectFor',
        args: [...args, jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId] as `0x${string}`],
      })

      const controllerData = encodeFunctionData({
        abi: jbController4_1Abi, // ABI of the contract
        functionName: 'launchProjectFor',
        args: [
          chainDeployData[0],
          chainDeployData[1],
          chainDeployData[2],
          chainDeployData[3],
          chainDeployData[4],
        ],
      })
      console.info('🧃launchProjectFor calldata (simulate in Tenderly):', {
        chainId,
        calldata: controllerData,
        address: jbContractAddress['4'][JBCoreContracts.JBController][chainId],
      })

      return {
        data: {
          from: userAddress,
          to: jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer4_1][chainId] as `0x${string}`,
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
        jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId] as `0x${string}` // all chains use the same controller
      ] as const

      const encodedData = encodeFunctionData({
        abi: jbOmnichainDeployer4_1Abi, // ABI of the contract
        functionName: 'launch721ProjectFor',
        args,
      })

      const controllerData = encodeFunctionData({
        abi: jb721TiersHookProjectDeployerAbi, // ABI of the contract
        functionName: 'launchProjectFor',
        args: chainDeployData,
      })
      console.info('🧃721 launchProjectFor calldata (simulate in Tenderly):', {
        jb721TiersHookProjectDeployer: {
          chainId,
          calldata: controllerData,
          address: jbContractAddress['4'][JB721HookContracts.JB721TiersHookProjectDeployer][chainId],
        },
        jbOmnichainDeployer: {
          chainId,
          calldata: encodedData,
          address: jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer4_1][chainId],
        },
      })

      return {
        data: {
          from: userAddress,
          to: jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer4_1][chainId] as `0x${string}`,
          value: 0n,
          gas: 3_000_000n * BigInt(chainIds.length), // Bigger mutliple for NFTS. TODO ba5sed might have a better suggestion here.
          data: encodedData,
        },
        chainId,
      }
    })

    return await getRelayrTxQuote(relayrTransactions)
  }

  return { deployOmnichainProject, deployOmnichainNftProject, sendRelayrTx, relayrBundle }
}
