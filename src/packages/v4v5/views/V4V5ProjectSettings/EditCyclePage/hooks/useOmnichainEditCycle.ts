import { JBChainId, jbContractAddress, JBOmnichainDeployerContracts, JBCoreContracts, jbOmnichainDeployer4_1Abi } from 'juice-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useJBContractContext, useSendRelayrTx } from 'juice-sdk-react'

import { useWallet } from 'hooks/Wallet'
import { EditCycleTxArgs } from 'packages/v4v5/utils/editRuleset'
import { encodeFunctionData } from 'viem'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { estimateContractGasWithFallback, OMNICHAIN_GAS_FALLBACKS } from 'packages/v4v5/utils/estimateOmnichainGas'

export function useOmnichainEditCycle() {
  const { userAddress } = useWallet()
  const { getRelayrTxQuote } = useGetRelayrTxQuote()
  const { sendRelayrTx } = useSendRelayrTx()
  const relayrBundle = useGetRelayrTxBundle()
  const { contracts } = useJBContractContext()
  const { version } = useV4V5Version()

  const projectControllerAddress = contracts.controller.data

  /**
   * Build and fetch a Relayr quote for editing across multiple chains
   */
  async function getEditQuote(
    editData: Record<JBChainId, EditCycleTxArgs>,
    chainIds: JBChainId[],
  ) {
    if (!userAddress || !projectControllerAddress) return

    const txs = await Promise.all(
      chainIds.map(async chainId => {
        const baseArgs = editData[chainId]
        if (!baseArgs) throw new Error(`No edit data for chain ${chainId}`)
        const args = [...baseArgs, projectControllerAddress] as const

        // V5 projects use V5's omnichain deployer, V4 projects use V4's deployers
        let to: `0x${string}`
        if (version === 5) {
          // V5 only has JBOmnichainDeployer
          to = jbContractAddress['5']['JBOmnichainDeployer'][chainId] as `0x${string}`
        } else {
          // V4 has two deployers: use 4_1 for controller 4.1, regular for older controllers
          to = jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer4_1][chainId] as `0x${string}`
          if (projectControllerAddress === jbContractAddress['4'][JBCoreContracts.JBController][chainId]) {
            to = jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer][chainId] as `0x${string}`
          }
        }

        const gas = await estimateContractGasWithFallback({
          chainId,
          contractAddress: to,
          abi: jbOmnichainDeployer4_1Abi,
          functionName: 'queueRulesetsOf',
          args,
          userAddress,
          fallbackGas: OMNICHAIN_GAS_FALLBACKS.QUEUE_RULESETS,
        })

        const encoded = encodeFunctionData({ abi: jbOmnichainDeployer4_1Abi, functionName: 'queueRulesetsOf', args })

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
