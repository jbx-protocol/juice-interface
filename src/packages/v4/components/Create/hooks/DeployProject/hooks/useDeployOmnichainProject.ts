import { useWallet } from 'hooks/Wallet'
import {
  createSalt,
  JBChainId,
  jbOmnichainDeployerAbi,
  parseSuckerDeployerConfig,
} from 'juice-sdk-core'
import { jbControllerAbi, jbOmnichainDeployerAddress, useGetRelayrTxQuote } from 'juice-sdk-react'
import { ContractFunctionArgs, encodeFunctionData } from 'viem'

export function useDeployOmnichainProject() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()

  async function deployOmnichainProject(
    deployData: ContractFunctionArgs<
      typeof jbControllerAbi,
      'nonpayable',
      'launchProjectFor'
    >,
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

      const args = [
        deployData[0],
        deployData[1],
        deployData[2],
        deployData[3],
        deployData[4],
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

  return deployOmnichainProject
}
