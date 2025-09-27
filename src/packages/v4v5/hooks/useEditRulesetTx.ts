import { NATIVE_TOKEN, jbContractAddress, JBCoreContracts, jbControllerAbi, jbController4_1Abi } from 'juice-sdk-core'
import {
  JBRulesetContext,
  useJBContractContext,
  useJBChainId
} from 'juice-sdk-react'
import { useWriteContract } from 'wagmi'
import { useCallback, useContext } from 'react'

import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from 'contexts/Para/Providers'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'
import { getContractVersionString } from '../utils/contractVersion'
import { transformEditCycleFormFieldsToTxArgs } from '../utils/editRuleset'
import { EditCycleFormFields } from '../views/V4ProjectSettings/EditCyclePage/EditCycleFormFields'

export interface EditMetadataTxOpts {
  onTransactionPending: (hash: `0x${string}`) => void
  onTransactionConfirmed: () => void
  onTransactionError: (error: Error) => void
}

/**
 * Takes data in EditCycleFormFields format, converts it to Edit Ruleset tx format and passes it to `writeEditRuleset`
 * @returns A function that deploys a project.
 * CURRENTLY UN-USED, using useOmnichainEditCycle everywhere
 */
export function useEditRulesetTx() {
  const { writeContractAsync: writeEditRuleset } = useWriteContract()

  const { contracts, projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()
  const versionString = getContractVersionString(version)
  const projectControllerAddress = contracts.controller.data

  const isV4_1 = projectControllerAddress && projectControllerAddress === jbContractAddress[versionString][JBCoreContracts.JBController4_1][chainId]
  const { addTransaction } = useContext(TxHistoryContext)
  const { rulesetMetadata } = useContext(JBRulesetContext)

  const { userAddress } = useWallet()

  return useCallback(
    async (
      formValues: EditCycleFormFields,
      {
        onTransactionPending: onTransactionPendingCallback,
        onTransactionConfirmed: onTransactionConfirmedCallback,
        onTransactionError: onTransactionErrorCallback,
      }: EditMetadataTxOpts,
    ) => {
      if (
        !contracts.controller.data ||
        !contracts.primaryNativeTerminal.data ||
        !userAddress
      ) {
        return
      }

      const args = transformEditCycleFormFieldsToTxArgs({
        formValues,
        primaryNativeTerminal: contracts.primaryNativeTerminal.data as `0x${string}`,
        tokenAddress: NATIVE_TOKEN as `0x${string}`,
        dataHook: (rulesetMetadata.data?.dataHook ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
        projectId,
      })

      try {
        // SIMULATE TX:
        // const encodedData = encodeFunctionData({
        //   abi: jbControllerAbi, // ABI of the contract
        //   functionName: 'queueRulesetsOf',
        //   args,
        // })
        // console.log('contracts address: ', contracts.controller.data)
        // console.log('encodedData: ', encodedData)

        const hash = await writeEditRuleset({
          address: contracts.controller.data,
          abi: isV4_1 ? jbController4_1Abi : jbControllerAbi,
          functionName: 'queueRulesetsOf',
          args,
        })

        onTransactionPendingCallback(hash)
        addTransaction?.('Edit Ruleset', { hash })
        await waitForTransactionReceipt(wagmiConfig, {
          hash,
        })

        onTransactionConfirmedCallback()
      } catch (e) {
        onTransactionErrorCallback(
          (e as Error) ?? new Error('Transaction failed'),
        )
      }
    },
    [
      projectId,
      contracts.controller.data,
      userAddress,
      writeEditRuleset,
      contracts.primaryNativeTerminal.data,
      addTransaction,
      rulesetMetadata.data?.dataHook,
      isV4_1,
    ],
  )
}
