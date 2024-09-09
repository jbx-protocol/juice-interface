import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { NATIVE_TOKEN } from 'juice-sdk-core'
import { useJBContractContext, useWriteJbControllerLaunchRulesetsFor } from 'juice-sdk-react'
import { useCallback, useContext } from 'react'
import { transformEditCycleFormFieldsToTxArgs } from '../utils/editRuleset'
import { EditCycleFormFields } from '../views/V4ProjectSettings/EditCyclePage/EditCycleFormFields'

export interface EditRulesetTxOpts {
  onTransactionPending: (hash: `0x${string}`) => void
  onTransactionConfirmed: () => void 
  onTransactionError: (error: Error) => void
}

/**
 * Takes data in EditCycleFormFields format, converts it to Edit Ruleset tx format and passes it to `writeEditRuleset`
 * @returns A function that deploys a project.
 */
export function useEditRulesetTx() {
  const { writeContractAsync: writeEditRuleset } = useWriteJbControllerLaunchRulesetsFor()
  const { contracts } = useJBContractContext()

  const { addTransaction } = useContext(TxHistoryContext)

  const { userAddress } = useWallet()

  return useCallback(
    async (formValues: EditCycleFormFields,
    {
      onTransactionPending: onTransactionPendingCallback,
      onTransactionConfirmed: onTransactionConfirmedCallback,
      onTransactionError: onTransactionErrorCallback,
    }: EditRulesetTxOpts
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
        primaryNativeTerminal: contracts.primaryNativeTerminal.data,
        tokenAddress: NATIVE_TOKEN
      })

      try {
        // SIMULATE TX:
        // const encodedData = encodeFunctionData({
        //   abi: jbControllerAbi, // ABI of the contract
        //   functionName: 'launchRulesetsFor', 
        //   args, 
        // })

        const hash = await writeEditRuleset({
          address: contracts.controller.data,
          args,
        })

        onTransactionPendingCallback(hash)
        addTransaction?.('Edit Ruleset', { hash })
        // const transactionReceipt: WaitForTransactionReceiptReturnType = await waitForTransactionReceipt(
        //   wagmiConfig,
        //   {
        //     hash,
        //   },
        // )

        onTransactionConfirmedCallback()
      } catch (e) {
        onTransactionErrorCallback(
          (e as Error) ?? new Error('Transaction failed'),
        )
      }
    },
    [
      contracts.controller.data,
      userAddress,
      writeEditRuleset,
      contracts.primaryNativeTerminal.data,
      addTransaction,
    ],
  )
}
