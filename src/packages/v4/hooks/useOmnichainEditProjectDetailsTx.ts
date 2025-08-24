import { JBChainId, createSalt, jbControllerAbi } from 'juice-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useJBContractContext, useSendRelayrTx } from 'juice-sdk-react'

import { useWallet } from 'hooks/Wallet'
import { useSuckers } from 'juice-sdk-react'
import { encodeFunctionData } from 'viem'

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
    const salt = createSalt()
    const txs = suckers.map(sucker => {
      const chainId = sucker.peerChainId as JBChainId
      const projectId = BigInt(sucker.projectId)
      const encoded = encodeFunctionData({
        abi: jbControllerAbi,
        functionName: 'setUriOf',
        args: [projectId, cid],
      })
      const to = controllerAddress as `0x${string}`
      return {
        data: { from: userAddress, to, value: 0n, gas: 200_000n * BigInt(suckers.length), data: encoded },
        chainId,
      }
    })
    return getRelayrTxQuote(txs)
  }

  return { getEditQuote, sendRelayrTx, relayrBundle }
}
