import {
  JBRulesetContext,
  useJBContractContext,
  useWriteJbController4_1QueueRulesetsOf,
  useWriteJbControllerQueueRulesetsOf
} from 'juice-sdk-react'
import { NATIVE_TOKEN, jbProjectDeploymentAddresses } from 'juice-sdk-core'
import { useCallback, useContext } from 'react'

import { EditCycleFormFields } from '../views/V4ProjectSettings/EditCyclePage/EditCycleFormFields'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { transformEditCycleFormFieldsToTxArgs } from '../utils/editRuleset'
import { useWallet } from 'hooks/Wallet'
import { wagmiConfig } from 'contexts/Para/Providers'
import { waitForTransactionReceipt } from '@wagmi/core'

export interface EditMetadataTxOpts {
  onTransactionPending: (hash: `0x${string}`) => void
  onTransactionConfirmed: () => void
  onTransactionError: (error: Error) => void
}

/**
 * Takes data in EditCycleFormFields format, converts it to Edit Ruleset tx format and passes it to `writeEditRuleset`
 * @returns A function that deploys a project.
 */
export function useEditRulesetTx() {
  const { writeContractAsync: writeEditController4Ruleset } =
    useWriteJbControllerQueueRulesetsOf()

  const { writeContractAsync: writeEditController4_1Ruleset } =
    useWriteJbController4_1QueueRulesetsOf()

  const { contracts, projectId } = useJBContractContext()
  const projectControllerAddress = contracts.controller.data

  let writeEditRuleset = writeEditController4Ruleset

  if (projectControllerAddress && projectControllerAddress === jbProjectDeploymentAddresses.JBController4_1[1]) {
    console.info('Using v4.1 controller for edit ruleset transaction')
    writeEditRuleset = writeEditController4_1Ruleset
  } else {
    console.info('Using v4 controller for edit ruleset transaction')
  }
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
    ],
  )
}
