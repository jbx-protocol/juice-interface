import { JBChainId, jbControllerAbi } from 'juice-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useJBContractContext, useSendRelayrTx } from 'juice-sdk-react'

import { useWallet } from 'hooks/Wallet'
import { useSuckers } from 'juice-sdk-react'
import { encodeFunctionData } from 'viem'
import { estimateContractGasWithFallback, OMNICHAIN_GAS_FALLBACKS } from '../utils/estimateOmnichainGas'

export function useOmnichainEditProjectDetailsTx() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()
  const { data: suckers } = useSuckers()
  const { contracts: { controller: { data: controllerAddress } } } = useJBContractContext()

  async function getEditQuote(
    cid: `0x${string}`
  ) {
    if (!userAddress || !controllerAddress) return
    if (!suckers || suckers.length === 0) throw new Error('No project chains available')

    const txs = await Promise.all(
      suckers.map(async sucker => {
        const chainId = sucker.peerChainId as JBChainId
        const projectId = BigInt(sucker.projectId)
        const args = [projectId, cid] as const

        const gas = await estimateContractGasWithFallback({
          chainId,
          contractAddress: controllerAddress as `0x${string}`,
          abi: jbControllerAbi,
          functionName: 'setUriOf',
          args,
          userAddress,
          fallbackGas: OMNICHAIN_GAS_FALLBACKS.SET_URI,
        })

        const encoded = encodeFunctionData({
          abi: jbControllerAbi,
          functionName: 'setUriOf',
          args,
        })
        const to = controllerAddress as `0x${string}`
        return {
          data: { from: userAddress, to, value: 0n, gas, data: encoded },
          chainId,
        }
      })
    )
    return getRelayrTxQuote(txs)
  }

  return { getEditQuote, sendRelayrTx, relayrBundle }
}
