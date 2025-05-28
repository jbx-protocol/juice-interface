import { Address, encodeFunctionData } from 'viem'
import { JBChainId, createSalt, jbOmnichainDeployerAbi, jbProjectDeploymentAddresses } from 'juice-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useSendRelayrTx } from 'juice-sdk-react'

import { EditCycleTxArgs } from 'packages/v4/utils/editRuleset'
import { useWallet } from 'hooks/Wallet'

export function useOmnichainEditCycle() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()

  /**
   * Build and fetch a Relayr quote for editing across multiple chains
   */
  async function getEditQuote(
    editData: Record<JBChainId, EditCycleTxArgs>,
    chainIds: JBChainId[],
  ) {
    if (!userAddress) return
    const salt = createSalt()
    const txs = chainIds.map(chainId => {
      const args = editData[chainId]
      if (!args) throw new Error(`No edit data for chain ${chainId}`)
      // ensure same salt in args if needed by transformEditCycleFormFieldsToTxArgs
      console.info('Edit cycle tx args', args)
      const encoded = encodeFunctionData({ abi: jbOmnichainDeployerAbi, functionName: 'queueRulesetsOf', args })
      const to = jbProjectDeploymentAddresses.JBController[chainId] as Address
      return {
        data: { from: userAddress, to, value: 0n, gas: 200_000n * BigInt(chainIds.length), data: encoded },
        chainId,
      }
    })
    return getRelayrTxQuote(txs)
  }

  return { getEditQuote, sendRelayrTx, relayrBundle }
}
