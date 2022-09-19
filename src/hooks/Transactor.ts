import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { Deferrable } from '@ethersproject/properties'
import { TransactionRequest } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import { Signer, Transaction } from 'ethers/lib/ethers'
import { useCallback, useContext } from 'react'

import { emitErrorNotification } from 'utils/notifications'

import { t } from '@lingui/macro'
import * as Sentry from '@sentry/browser'

import { TxHistoryContext } from 'contexts/txHistoryContext'
import { CV } from 'models/cv'
import { useWallet } from './Wallet'

type TransactorCallback = (e?: Transaction, signer?: Signer) => void

export type TransactorOptions = {
  title?: string
  value?: BigNumberish
  onDone?: VoidFunction
  onConfirmed?: TransactorCallback
  onCancelled?: TransactorCallback
  onError?: ErrorCallback
}

type TxOpts = Omit<TransactorOptions, 'value'>

export function onCatch({
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
  options?: TransactorOptions,
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
      options?: TransactorOptions,
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
        let result
        if (tx instanceof Promise) {
          console.info('Transactor::AWAITING TX', tx)
          result = await tx

          addTransaction?.(txTitle, result)
        } else {
          console.info('Transactor::RUNNING TX', tx)

          if (!tx.gasPrice) tx.gasPrice = gasPrice ?? parseUnits('4.1', 'gwei')
          if (!tx.gasLimit) tx.gasLimit = hexlify(120000)

          result = await signer.sendTransaction(tx)

          addTransaction?.(txTitle, result)

          await result.wait()
        }
        console.info('Transactor::RESULT::', result)

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
