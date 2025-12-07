import { JBChainId, jbContractAddress, JBCoreContracts, jbProjectsAbi } from 'juice-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useSendRelayrTx } from 'juice-sdk-react'
import { Address, encodeFunctionData } from 'viem'

import { useWallet } from 'hooks/Wallet'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'
import { estimateContractGasWithFallback, OMNICHAIN_GAS_FALLBACKS } from '../utils/estimateOmnichainGas'

export function useTransferOmnichainProjectOwnership() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5'

  
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

    const relayrTransactions = await Promise.all(
      chainIds.map(async chainId => {
        const transferArgs = transferData[chainId]
        if (!transferArgs) throw new Error('No transfer data for chain ' + chainId)

        const args = [transferArgs.from, transferArgs.to, transferArgs.tokenId] as const
        const to = jbContractAddress[versionString][JBCoreContracts.JBProjects][chainId] as Address

        const gas = await estimateContractGasWithFallback({
          chainId,
          contractAddress: to,
          abi: jbProjectsAbi,
          functionName: 'safeTransferFrom',
          args,
          userAddress,
          fallbackGas: OMNICHAIN_GAS_FALLBACKS.TRANSFER_OWNERSHIP,
        })

        const encoded = encodeFunctionData({
          abi: jbProjectsAbi,
          functionName: 'safeTransferFrom',
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

    const result = await getRelayrTxQuote(relayrTransactions)
    return result
  }

  return { transferOmnichainProjectOwnership, sendRelayrTx, relayrBundle }
}
