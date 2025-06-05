import { ContractFunctionArgs, encodeFunctionData } from 'viem'
import {
  JBChainId,
  createSalt,
  jbOmnichainDeployerAbi,
  jbProjectDeploymentAddresses,
  parseSuckerDeployerConfig,
} from 'juice-sdk-core'
import {
  jb721TiersHookProjectDeployerAbi,
  jb721TiersHookProjectDeployerAddress,
  jbController4_1Address,
  jbControllerAbi,
  jbOmnichainDeployer4_1Abi,
  jbOmnichainDeployer4_1Address,
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
        typeof jbControllerAbi,
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
        abi: jbOmnichainDeployerAbi, // ABI of the contract
        functionName: 'launchProjectFor',
        args,
      })

      const controllerData = encodeFunctionData({
        abi: jbControllerAbi, // ABI of the contract
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
        address: jbProjectDeploymentAddresses.JBController,
      })

      return {
        data: {
          from: userAddress,
          to: jbOmnichainDeployer4_1Address[chainId],
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
        jbController4_1Address[1] // all chains use the same controller
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
          address: jb721TiersHookProjectDeployerAddress[chainId],
        },
        jbOmnichainDeployer: {
          chainId,
          calldata: encodedData,
          address: jbOmnichainDeployer4_1Address[chainId],
        },
      })

      return {
        data: {
          from: userAddress,
          to: jbOmnichainDeployer4_1Address[chainId],
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
