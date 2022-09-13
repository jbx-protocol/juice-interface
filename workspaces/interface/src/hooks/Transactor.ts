import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { Deferrable } from '@ethersproject/properties'
import { TransactionRequest } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import Notify, { InitOptions, TransactionEvent } from 'bnc-notify'
import { ThemeContext } from 'contexts/themeContext'
import { Signer } from 'ethers/lib/ethers'
import { useCallback, useContext } from 'react'

import { emitErrorNotification } from 'utils/notifications'

import { t } from '@lingui/macro'
import * as Sentry from '@sentry/browser'
import { windowOpen } from 'utils/windowUtils'

import { useWallet } from './Wallet'

type TransactorCallback = (e?: TransactionEvent, signer?: Signer) => void

type TransactorOptions = {
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
  version,
}: {
  txOpts?: TxOpts
  missingParam?: string
  functionName: string
  version: 'v1' | 'v2'
}) {
  txOpts?.onError?.(
    new DOMException(
      `Missing ${
        missingParam ?? 'unknown'
      } parameter in ${functionName} ${version}`,
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

// wrapper around BlockNative's Notify.js
// https://docs.blocknative.com/notify
export function useTransactor({
  gasPrice,
}: {
  gasPrice?: BigNumber
}): Transactor | undefined {
  const { chain, signer } = useWallet()
  const chainId = chain ? BigNumber.from(chain.id) : undefined
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()

  const { isDarkMode } = useContext(ThemeContext)

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

      const notifyOpts: InitOptions = {
        dappId: process.env.NEXT_PUBLIC_BLOCKNATIVE_API_KEY,
        system: 'ethereum',
        networkId: chainId?.toNumber(),
        darkMode: isDarkMode,
        transactionHandler: txInformation => {
          console.info('HANDLE TX', txInformation)
          if (options && txInformation.transaction.status === 'confirmed') {
            options?.onConfirmed?.(txInformation, signer)
            options?.onDone?.()
          }
          if (options && txInformation.transaction.status === 'cancelled') {
            options?.onCancelled?.(txInformation, signer)
          }
        },
      }
      const notify = Notify(notifyOpts)

      let etherscanNetwork = ''
      if (chain.name && chainId?.gt(1)) {
        etherscanNetwork = chain.name + '.'
      }

      let etherscanTxUrl = 'https://' + etherscanNetwork + 'etherscan.io/tx/'
      if (chainId?.eq(100)) {
        etherscanTxUrl = 'https://blockscout.com/poa/xdai/tx/'
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
        '🧃 Calling ' + functionName + '() with args:',
        reportArgs,
        tx,
      )

      try {
        let result

        if (tx instanceof Promise) {
          console.info('AWAITING TX', tx)
          result = await tx
        } else {
          console.info('RUNNING TX', tx)

          if (!tx.gasPrice) tx.gasPrice = gasPrice ?? parseUnits('4.1', 'gwei')

          if (!tx.gasLimit) tx.gasLimit = hexlify(120000)

          result = await signer.sendTransaction(tx)
          await result.wait()
        }
        console.info('RESULT:', result)

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        const isNotifyNetwork =
          [1, 3, 4, 5, 42, 100].indexOf(chainId?.toNumber() ?? -1) >= 0

        if (isNotifyNetwork) {
          const { emitter } = notify.hash(result.hash)
          emitter.on('all', transaction => ({
            onclick: () => windowOpen(etherscanTxUrl + transaction.hash, false),
          }))
        } else {
          console.info('LOCAL TX SENT', result.hash)
          if (result.confirmations) {
            options?.onConfirmed?.(result, signer)
          } else {
            options?.onCancelled?.(result, signer)
          }
        }

        options?.onDone?.()

        return true
      } catch (e) {
        const message = (e as Error).message

        console.error('Transaction Error:', message)
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
      chainId,
      isDarkMode,
      changeNetworks,
      connect,
      gasPrice,
    ],
  )
}
