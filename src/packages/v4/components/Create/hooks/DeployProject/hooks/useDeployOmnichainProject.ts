import { useWallet } from 'hooks/Wallet'
import {
  createSalt,
  JBChainId,
  jbOmnichainDeployerAbi,
  parseSuckerDeployerConfig,
} from 'juice-sdk-core'
import {
  jb721TiersHookProjectDeployerAbi,
  jbControllerAbi,
  jbOmnichainDeployerAddress,
  useGetRelayrTxQuote,
} from 'juice-sdk-react'
import { ContractFunctionArgs, encodeFunctionData } from 'viem'

export function useDeployOmnichainProject() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()

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
      /**
       * UNCOMMENT THIS BLOCK TO GET TENDERLY SIM DATA
       */
      // const controllerData =  encodeFunctionData({
      //   abi: jbControllerAbi, // ABI of the contract
      //   functionName: 'launchProjectFor',
      //   args: [
      //     chainDeployData[0],
      //     chainDeployData[1],
      //     chainDeployData[2],
      //     chainDeployData[3],
      //     chainDeployData[4],
      //   ]
      // })
      // console.log('controllerData', chainId, controllerData, jbProjectDeploymentAddresses.JBController)

      return {
        data: {
          from: userAddress,
          to: jbOmnichainDeployerAddress[chainId],
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
      ] as const

      const encodedData = encodeFunctionData({
        abi: jbOmnichainDeployerAbi, // ABI of the contract
        functionName: 'launch721ProjectFor',
        args,
      })
      // console.log('encodedData', chainId, encodedData)

      /**
       * UNCOMMENT THIS BLOCK TO GET TENDERLY SIM DATA
       */
      // const controllerData =  encodeFunctionData({
      //   abi: jbControllerAbi, // ABI of the contract
      //   functionName: 'launchProjectFor',
      //   args: [
      //     chainDeployData[0],
      //     chainDeployData[1],
      //     chainDeployData[2],
      //     chainDeployData[3],
      //     chainDeployData[4],
      //   ]
      // })
      // console.log('controllerData', chainId, controllerData, jbProjectDeploymentAddresses.JBController)

      return {
        data: {
          from: userAddress,
          to: jbOmnichainDeployerAddress[chainId],
          value: 0n,
          gas: 1_000_000n * BigInt(chainIds.length),
          data: encodedData,
        },
        chainId,
      }
    })

    return await getRelayrTxQuote(relayrTransactions)
  }

  return { deployOmnichainProject, deployOmnichainNftProject }
}
