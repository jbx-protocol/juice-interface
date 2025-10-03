import { useCallback, useContext } from 'react'

import { waitForTransactionReceipt } from '@wagmi/core'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useJBContractContext } from 'juice-sdk-react'
import { jbControllerAbi, JBChainId } from 'juice-sdk-core'
import { useWriteContract, useChainId } from 'wagmi'
import { Address, zeroAddress } from 'viem'
import { BaseTxOpts } from '../models/transactions'
import { wagmiConfig } from '../wagmiConfig'

export function useV4V5IssueErc20TokenTx() {
  const { addTransaction } = useContext(TxHistoryContext)
  const { projectId, contracts } = useJBContractContext()
  const chainId = useChainId()

  const { writeContractAsync: deployErc20Tx } = useWriteContract()

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
        //   abi: jbControllerAbi, // ABI of the contract
        //   functionName: 'deployERC20For', 
        //   args, 
        // })
        // console.log('contract', contracts.controller.data)
        // console.log('encodedData', encodedData)

        const hash = await deployErc20Tx({
          abi: jbControllerAbi,
          functionName: 'deployERC20For',
          args,
          address: contracts.controller.data as Address
        })

        onTransactionPendingCallback(hash)
        addTransaction?.('Launch ERC20 Token', { hash, chainId: chainId as JBChainId })
        await waitForTransactionReceipt(
          wagmiConfig,
          {
            hash,
            chainId: chainId as JBChainId,
          },
        )

        onTransactionConfirmedCallback()
      } catch (e) {
        onTransactionErrorCallback(
          (e as Error) ?? new Error('Transaction failed'),
        )
      }
    },
    [
      deployErc20Tx,
      projectId,
      addTransaction,
      contracts.controller.data,
      chainId,
    ],
  )
}
