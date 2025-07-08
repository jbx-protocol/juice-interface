import { JBChainId, jbController4_1Abi, jbProjectDeploymentAddresses } from 'juice-sdk-core'
import { jbControllerAbi, useGetRelayrTxBundle, useGetRelayrTxQuote, useJBContractContext, useSendRelayrTx } from 'juice-sdk-react'
import { ContractFunctionArgs, encodeFunctionData } from 'viem'

import { useWallet } from 'hooks/Wallet'
import { Address } from 'viem'

export function useDeployOmnichainErc20() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()

  const { contracts } = useJBContractContext()

  const projectControllerAddress = contracts.controller.data

  async function deployOmnichainErc20(
    deployData: {
      [k in JBChainId]?: ContractFunctionArgs<typeof jbControllerAbi, 'nonpayable', 'deployERC20For'>
    },
    chainIds: JBChainId[],
  ) {
    if (!userAddress) return

    const relayrTransactions = chainIds.map(chainId => {
      const args = deployData[chainId]
      let encoded
      if (!args) throw new Error('No deploy data for chain ' + chainId)
      
        if (projectControllerAddress === jbProjectDeploymentAddresses.JBController4_1[1]) {
        // Use v4.1 controller ABI
        encoded = encodeFunctionData({
          abi: jbController4_1Abi,
          functionName: 'deployERC20For',
          args,
        })
      } else {
        // Use v4 controller ABI
        encoded = encodeFunctionData({
          abi: jbControllerAbi,
          functionName: 'deployERC20For',
          args,
        })
      }

      const to = projectControllerAddress as Address
      return {
        data: {
          from: userAddress,
          to,
          value: 0n,
          gas: 300_000n * BigInt(chainIds.length),
          data: encoded,
        },
        chainId,
      }
    })

    return getRelayrTxQuote(relayrTransactions)
  }

  return { deployOmnichainErc20, sendRelayrTx, relayrBundle }
}
