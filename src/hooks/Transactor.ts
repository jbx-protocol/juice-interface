import { BigNumber } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { Deferrable } from '@ethersproject/properties'
import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { t } from '@lingui/macro'
import * as Sentry from '@sentry/browser'
import { readNetwork } from 'constants/networks'
import { TxHistoryContext } from 'contexts/txHistoryContext'
import { getArcxClient } from 'lib/arcx'
import { CV } from 'models/cv'
import { TransactionOptions } from 'models/transaction'
import { useCallback, useContext } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { useWallet } from './Wallet'

type TxOpts = Omit<TransactionOptions, 'value'>

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

export type Transactor = (
  contract: Contract,
  functionName: string,
  args: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: TransactionOptions,
) => Promise<boolean>

export type TransactorInstance<T = undefined> = (
  args: T,
  txOpts?: TxOpts,
) => ReturnType<Transactor>

export function useTransactor({
  gasPrice,
}: {
  gasPrice?: BigNumber
}): Transactor | undefined {
  const { chain, signer } = useWallet()
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()
  const { addTransaction } = useContext(TxHistoryContext)

  return useCallback(
    async (
      contract: Contract,
      functionName: string,
      args: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
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

      const tx: Deferrable<TransactionRequest> =
        options?.value !== undefined
          ? contract[functionName](...args, { value: options.value })
          : contract[functionName](...args)

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
        tx,
      )

      const txTitle = options?.title ?? functionName

      try {
        let result: unknown

        if (tx instanceof Promise) {
          console.info('Transactor::AWAITING TX', tx)
          result = await tx

          addTransaction?.(txTitle, result as TransactionResponse, {
            onConfirmed: options?.onConfirmed,
            onCancelled: options?.onCancelled,
          })
        } else {
          console.info('Transactor::RUNNING TX', tx)

          if (!tx.gasPrice) tx.gasPrice = gasPrice ?? parseUnits('4.1', 'gwei')
          if (!tx.gasLimit) tx.gasLimit = hexlify(120000)

          result = await signer.sendTransaction(tx)
          const txResponse = result as TransactionResponse

          addTransaction?.(txTitle, txResponse, {
            onConfirmed: options?.onConfirmed,
            onCancelled: options?.onCancelled,
          })

          await txResponse.wait()

          getArcxClient().then(arcx => {
            arcx?.transaction({
              chain: readNetwork.chainId, // required(string) - chain ID that the transaction is taking place on
              transactionHash: txResponse.hash as string,
            })
          })
        }

        console.info('Transactor::RESULT::', result)

        // transaction was submitted, but not confirmed/mined yet.
        options?.onDone?.()

        return true
      } catch (e) {
        const message = (e as Error).message

        console.error('Transactor::Transaction Error:', message)
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
      chainUnsupported,
      isConnected,
      signer,
      chain,
      changeNetworks,
      connect,
      gasPrice,
      addTransaction,
    ],
  )
}
