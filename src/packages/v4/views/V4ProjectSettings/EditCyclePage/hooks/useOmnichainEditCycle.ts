import { JBChainId, createSalt, jbContractAddress, JBOmnichainDeployerContracts, JBCoreContracts, jbOmnichainDeployer4_1Abi } from 'juice-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useJBContractContext, useSendRelayrTx } from 'juice-sdk-react'

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
      let to: `0x${string}` = jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer4_1][chainId] as `0x${string}`
      if (projectControllerAddress === jbContractAddress['4'][JBCoreContracts.JBController][chainId]) {
        to = jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer][chainId] as `0x${string}`
      }
      return {
        data: { from: userAddress, to, value: 0n, gas: 200_000n * BigInt(chainIds.length), data: encoded },
        chainId,
      }
    })
    return getRelayrTxQuote(txs)
  }

  return { getEditQuote, sendRelayrTx, relayrBundle }
}
