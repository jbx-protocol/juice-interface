import { JBChainId, createSalt, jbControllerAbi, jbProjectDeploymentAddresses } from 'juice-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useSendRelayrTx } from 'juice-sdk-react'

import { encodeFunctionData } from 'viem'
import { useSuckers } from 'juice-sdk-react'
import { useWallet } from 'hooks/Wallet'

export function useOmnichainEditProjectDetailsTx() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()
  const { data: suckers } = useSuckers()

  async function getEditQuote(
    cid: `0x${string}`
  ) {
    if (!userAddress) return
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
      const to = jbProjectDeploymentAddresses.JBController[chainId] as `0x${string}`
      return {
        data: { from: userAddress, to, value: 0n, gas: 200_000n * BigInt(suckers.length), data: encoded },
        chainId,
      }
    })
    return getRelayrTxQuote(txs)
  }

  return { getEditQuote, sendRelayrTx, relayrBundle }
}
