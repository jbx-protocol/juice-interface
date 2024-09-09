import { useCallback, useContext } from 'react'

import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useJBContractContext, useWriteJbTokensDeployErc20For } from 'juice-sdk-react'
import { zeroAddress } from 'viem'
import { BaseTxOpts } from '../models/transactions'

export function useV4IssueErc20TokenTx() {
  const { addTransaction } = useContext(TxHistoryContext)
  const { projectId, contracts } = useJBContractContext()

  const { writeContractAsync: deployErc20 } = useWriteJbTokensDeployErc20For()

  return useCallback  (
    async ({ name, symbol }: {
      name: string
      symbol: string
    },
    {
      onTransactionPending: onTransactionPendingCallback,
      onTransactionConfirmed: onTransactionConfirmedCallback,
      onTransactionError: onTransactionErrorCallback,
    }: BaseTxOpts
  ) => {
      if (
        !projectId || !name || !symbol
      ) {
        return
      }

      const args = [projectId, name, symbol, `${zeroAddress}000000000000000000000000`] as const

      try {
        // SIMULATE TX:
        // const encodedData = encodeFunctionData({
        //   abi: jbTokensAbi, // ABI of the contract
        //   functionName: 'deployErc20For', 
        //   args, 
        // })

        const hash = await deployErc20({
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
      deployErc20,
      projectId,
      addTransaction,
    ],
  )
}
