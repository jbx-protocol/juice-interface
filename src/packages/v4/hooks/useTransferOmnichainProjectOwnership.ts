import { JBChainId, jbProjectsAddress } from 'juice-sdk-core'
import { jbProjectsAbi, useGetRelayrTxBundle, useGetRelayrTxQuote, useSendRelayrTx } from 'juice-sdk-react'
import { Address, encodeFunctionData } from 'viem'

import { useWallet } from 'hooks/Wallet'

export function useTransferOmnichainProjectOwnership() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()

  
  async function transferOmnichainProjectOwnership(
    transferData: {
      [k in JBChainId]?: {
        from: Address
        to: Address
        tokenId: bigint
      }
    },
    chainIds: JBChainId[],
  ) {    
    if (!userAddress) {
      return
    }

    const relayrTransactions = chainIds.map(chainId => {
      const args = transferData[chainId]
      if (!args) throw new Error('No transfer data for chain ' + chainId)
      
      const encoded = encodeFunctionData({
        abi: jbProjectsAbi,
        functionName: 'safeTransferFrom',
        args: [args.from, args.to, args.tokenId],
      })
      
      const to = jbProjectsAddress[1] as Address
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

    const result = await getRelayrTxQuote(relayrTransactions)
    return result
  }

  return { transferOmnichainProjectOwnership, sendRelayrTx, relayrBundle }
}
