import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { useJBContractContext, useWriteJbControllerSetUriOf } from 'juice-sdk-react'
import { useCallback, useContext } from 'react'

export interface EditRulesetTxOpts {
  onTransactionPending: (hash: `0x${string}`) => void
  onTransactionConfirmed: () => void 
  onTransactionError: (error: Error) => void
}

/**
 * Takes data in EditCycleFormFields format, converts it to Edit Ruleset tx format and passes it to `writeEditRuleset`
 * @returns A function that deploys a project.
 */
export function useEditProjectDetailsTx() {
  const { writeContractAsync: writeEditMetadata } = useWriteJbControllerSetUriOf()
  const { contracts, projectId } = useJBContractContext()

  const { addTransaction } = useContext(TxHistoryContext)

  const { userAddress } = useWallet()

  return useCallback(
    async (cid: `0x${string}`,
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

      const args = [
        projectId, 
        cid
      ] as const

      try {
        // SIMULATE TX:
        // const encodedData = encodeFunctionData({
        //   abi: jbControllerAbi, // ABI of the contract
        //   functionName: 'setUriOf', 
        //   args, 
        // })

        const hash = await writeEditMetadata({
          address: contracts.controller.data,
          args
        })

        onTransactionPendingCallback(hash)
        addTransaction?.('Edit Metadata', { hash })
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
      writeEditMetadata,
      contracts.primaryNativeTerminal.data,
      projectId,
      addTransaction,
    ],
  )
}
