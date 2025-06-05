import { waitForTransactionReceipt } from '@wagmi/core'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { NATIVE_TOKEN } from 'juice-sdk-core'
import {
  JBRulesetContext,
  useJBChainId,
  useJBContractContext,
  useWriteJbControllerQueueRulesetsOf,
} from 'juice-sdk-react'
import { getWagmiConfig } from '@getpara/evm-wallet-connectors';
import { useCallback, useContext } from 'react'
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
 */
export function useEditRulesetTx() {
  const chainId = useJBChainId()
  const { writeContractAsync: writeEditRuleset } =
    useWriteJbControllerQueueRulesetsOf()

  const { contracts, projectId } = useJBContractContext()

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
        primaryNativeTerminal: contracts.primaryNativeTerminal.data,
        tokenAddress: NATIVE_TOKEN,
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
        const wagmiConfig = getWagmiConfig();
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
