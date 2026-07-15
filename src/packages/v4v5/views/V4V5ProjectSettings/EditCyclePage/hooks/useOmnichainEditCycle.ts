import { JBChainId, jbContractAddress, JBOmnichainDeployerContracts, JBCoreContracts, jbOmnichainDeployerAbi, jbOmnichainDeployer4_1Abi, jbOmnichainDeployerV5Abi } from '@bananapus/nana-sdk-core'
import { useGetRelayrTxBundle, useGetRelayrTxQuote, useJBContractContext, useSendRelayrTx } from '@bananapus/nana-sdk-react'

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

        let to: `0x${string}`
        let encoded: `0x${string}`
        let gas: bigint

        if (version === 6) {
          // V6's omnichain deployer dropped the trailing controller arg from queueRulesetsOf
          to = jbContractAddress['6'][JBOmnichainDeployerContracts.JBOmnichainDeployer][chainId] as `0x${string}`
          gas = await estimateContractGasWithFallback({
            chainId,
            contractAddress: to,
            abi: jbOmnichainDeployerAbi,
            functionName: 'queueRulesetsOf',
            args: baseArgs,
            userAddress,
            fallbackGas: OMNICHAIN_GAS_FALLBACKS.QUEUE_RULESETS,
          })
          encoded = encodeFunctionData({ abi: jbOmnichainDeployerAbi, functionName: 'queueRulesetsOf', args: baseArgs })
        } else {
          // V4/V5 deployers take a trailing controller arg
          const args = [...baseArgs, projectControllerAddress] as const

          if (version === 5) {
            // V5 only has JBOmnichainDeployer
            to = jbContractAddress['5'][JBOmnichainDeployerContracts.JBOmnichainDeployer][chainId] as `0x${string}`
          } else {
            // V4 has two deployers: use 4_1 for controller 4.1, regular for older controllers
            to = jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer4_1][chainId] as `0x${string}`
            if (projectControllerAddress === jbContractAddress['4'][JBCoreContracts.JBController][chainId]) {
              to = jbContractAddress['4'][JBOmnichainDeployerContracts.JBOmnichainDeployer][chainId] as `0x${string}`
            }
          }

          const abi = version === 5 ? jbOmnichainDeployerV5Abi : jbOmnichainDeployer4_1Abi
          gas = await estimateContractGasWithFallback({
            chainId,
            contractAddress: to,
            abi,
            functionName: 'queueRulesetsOf',
            args,
            userAddress,
            fallbackGas: OMNICHAIN_GAS_FALLBACKS.QUEUE_RULESETS,
          })
          encoded = encodeFunctionData({ abi, functionName: 'queueRulesetsOf', args })
        }

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
