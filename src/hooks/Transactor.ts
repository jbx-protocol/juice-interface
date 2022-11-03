import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import * as Sentry from '@sentry/browser'
import { readNetwork } from 'constants/networks'
import { TxHistoryContext } from 'contexts/txHistoryContext'
import { simulateTransaction } from 'lib/tenderly'
import { CV } from 'models/cv'
import { TransactionOptions } from 'models/transaction'
import { useCallback, useContext } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { useArcx } from './Arcx'
import { useWallet } from './Wallet'

type TxOpts = Omit<TransactionOptions, 'value'>

function logTx({
  functionName,
  contract,
  args,
}: {
  functionName: string
  contract: Contract
  args: unknown[]
}) {
  const reportArgs = Object.values(contract.interface.functions)
    .find(f => f.name === functionName)
    ?.inputs.reduce(
      (acc, input, i) => ({
        ...acc,
        [input.name]: args[i],
      }),
      {},
    )

  console.info(
    '🧃 Transactor::Calling ' + functionName + '() with args:',
    reportArgs,
  )
}

function prepareTransaction({
  functionName,
  contract,
  args,
  options,
}: {
  functionName: string
  contract: Contract
  args: unknown[]
  options: TransactionOptions | undefined
}) {
  const tx =
    options?.value !== undefined
      ? contract[functionName](...args, { value: options.value })
      : contract[functionName](...args)

  return tx
}

export type Transactor = (
  contract: Contract,
  functionName: string,
  args: unknown[],
  options?: TransactionOptions,
) => Promise<boolean>

export type TransactorInstance<T = undefined> = (
  args: T,
  txOpts?: TxOpts,
) => ReturnType<Transactor>

export function useTransactor(): Transactor | undefined {
  const { addTransaction } = useContext(TxHistoryContext)

  const { chain, signer, userAddress } = useWallet()
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()
  const arcx = useArcx()

  return useCallback(
    async (
      contract: Contract,
      functionName: string,
      args: unknown[],
      options?: TransactionOptions,
    ) => {
      if (chainUnsupported) {
        await changeNetworks()
        options?.onDone?.()
        return false
      }
      if (!isConnected) {
        await connect()
        options?.onDone?.()
        return false
      }
      if (!signer || !chain) {
        options?.onDone?.()
        return false
      }

      logTx({ functionName, contract, args })

      if (process.env.NODE_ENV === 'development') {
        await simulateTransaction({ contract, functionName, args, userAddress })
      }

      try {
        const tx = prepareTransaction({ functionName, contract, args, options })
        const result: TransactionResponse = await tx

        console.info('✅ Transactor::submitted', result)

        // transaction was submitted, but not confirmed/mined yet.
        options?.onDone?.()

        // add transaction to the history UI
        const txTitle = options?.title ?? functionName
        addTransaction?.(txTitle, result as TransactionResponse, {
          onConfirmed: options?.onConfirmed,
          onCancelled: options?.onCancelled,
        })

        try {
          // log transaction in Arcx
          arcx?.transaction({
            chain: readNetwork.chainId, // required(string) - chain ID that the transaction is taking place on
            transactionHash: result?.hash as string,
            metadata: {
              functionName,
              title: txTitle,
            },
          })
        } catch (_) {
          // ignore
          console.warn('Arcx transaction logging failed')
        }

        return true
      } catch (e) {
        const message = (e as Error).message

        console.error('Transactor::error', message)

        Sentry.captureException(e, {
          tags: {
            contract_function: functionName,
          },
        })

        let description: string
        try {
          let json = message.split('(error=')[1]
          json = json.split(', method=')[0]
          description = JSON.parse(json).message || message
        } catch (_) {
          description = message
          options?.onError?.(new DOMException(description))
          emitErrorNotification(t`Transaction failed`, { description })
        }

        options?.onDone?.()

        return false
      }
    },
    [
      arcx,
      chainUnsupported,
      isConnected,
      signer,
      chain,
      changeNetworks,
      connect,
      addTransaction,
      userAddress,
    ],
  )
}

export function handleTransactionException({
  txOpts,
  missingParam,
  functionName,
  cv,
}: {
  txOpts?: TxOpts
  missingParam?: string
  functionName: string
  cv: CV | undefined
}) {
  txOpts?.onError?.(
    new DOMException(
      `Missing ${missingParam ?? 'unknown'} parameter in ${functionName}${
        cv ? ` v${cv}` : ''
      }`,
    ),
  )
  txOpts?.onDone?.()
  return Promise.resolve(false)
}
