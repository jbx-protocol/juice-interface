import { JBChainId, createSalt, jbOmnichainDeployer4_1Address } from 'juice-sdk-core'
import { jbOmnichainDeployer4_1Abi, useGetRelayrTxBundle, useGetRelayrTxQuote, useJBContractContext, useSendRelayrTx } from 'juice-sdk-react'

import { useWallet } from 'hooks/Wallet'
import { EditCycleTxArgs } from 'packages/v4/utils/editRuleset'
import { encodeFunctionData } from 'viem'

export function useOmnichainEditCycle() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()
  const { contracts } = useJBContractContext()

  const projectControllerAddress = contracts.controller.data

  /**
   * Build and fetch a Relayr quote for editing across multiple chains
   */
  async function getEditQuote(
    editData: Record<JBChainId, EditCycleTxArgs>,
    chainIds: JBChainId[],
  ) {
    if (!userAddress || !projectControllerAddress) return
    const salt = createSalt()
    const txs = chainIds.map(chainId => {
      const baseArgs = editData[chainId]
      if (!baseArgs) throw new Error(`No edit data for chain ${chainId}`)
      const args = [...baseArgs, projectControllerAddress] as const
      // ensure same salt in args if needed by transformEditCycleFormFieldsToTxArgs
      console.info('Edit cycle tx args', args)
      const encoded = encodeFunctionData({ abi: jbOmnichainDeployer4_1Abi, functionName: 'queueRulesetsOf', args})
      const to = jbOmnichainDeployer4_1Address[1]
      return {
        data: { from: userAddress, to, value: 0n, gas: 200_000n * BigInt(chainIds.length), data: encoded },
        chainId,
      }
    })
    return getRelayrTxQuote(txs)
  }

  return { getEditQuote, sendRelayrTx, relayrBundle }
}
