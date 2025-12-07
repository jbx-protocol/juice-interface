import { JBChainId, jbController4_1Abi, jbControllerAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useJBContractContext, useSendRelayrTx } from 'juice-sdk-react'
import { ContractFunctionArgs, encodeFunctionData } from 'viem'

import { useWallet } from 'hooks/Wallet'
import { Address } from 'viem'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'
import { estimateContractGasWithFallback, OMNICHAIN_GAS_FALLBACKS } from '../utils/estimateOmnichainGas'

export function useDeployOmnichainErc20() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()
  const { version } = useV4V5Version()

  const { contracts } = useJBContractContext()

  const projectControllerAddress = contracts.controller.data

  async function deployOmnichainErc20(
    deployData: {
      [k in JBChainId]?: ContractFunctionArgs<typeof jbControllerAbi, 'nonpayable', 'deployERC20For'>
    },
    chainIds: JBChainId[],
  ) {
    if (!userAddress || !projectControllerAddress) return

    const relayrTransactions = await Promise.all(
      chainIds.map(async chainId => {
        const args = deployData[chainId]
        if (!args) throw new Error('No deploy data for chain ' + chainId)

        const useV41Abi = version === 4 && projectControllerAddress === jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId]
        const abi = useV41Abi ? jbController4_1Abi : jbControllerAbi

        const to = projectControllerAddress as Address

        const gas = await estimateContractGasWithFallback({
          chainId,
          contractAddress: to,
          abi,
          functionName: 'deployERC20For',
          args,
          userAddress,
          fallbackGas: OMNICHAIN_GAS_FALLBACKS.DEPLOY_ERC20,
        })

        const encoded = encodeFunctionData({
          abi,
          functionName: 'deployERC20For',
          args,
        })

        return {
          data: {
            from: userAddress,
            to,
            value: 0n,
            gas,
            data: encoded,
          },
          chainId,
        }
      })
    )

    return getRelayrTxQuote(relayrTransactions)
  }

  return { deployOmnichainErc20, sendRelayrTx, relayrBundle }
}
