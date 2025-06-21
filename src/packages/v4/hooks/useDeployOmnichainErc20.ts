import { JBChainId, jbProjectDeploymentAddresses } from 'juice-sdk-core'
import { jbControllerAbi, useGetRelayrTxBundle, useGetRelayrTxQuote, useSendRelayrTx } from 'juice-sdk-react'
import { ContractFunctionArgs, encodeFunctionData } from 'viem'

import { useWallet } from 'hooks/Wallet'
import { Address } from 'viem'

export function useDeployOmnichainErc20() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()

  async function deployOmnichainErc20(
    deployData: {
      [k in JBChainId]?: ContractFunctionArgs<typeof jbControllerAbi, 'nonpayable', 'deployERC20For'>
    },
    chainIds: JBChainId[],
  ) {
    if (!userAddress) return

    const relayrTransactions = chainIds.map(chainId => {
      const args = deployData[chainId]
      if (!args) throw new Error('No deploy data for chain ' + chainId)
      const encoded = encodeFunctionData({
        abi: jbControllerAbi,
        functionName: 'deployERC20For',
        args,
      })
      // use controller address for each chain
      const to = jbProjectDeploymentAddresses.JBController[chainId] as Address
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
