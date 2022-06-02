import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { Deferrable } from '@ethersproject/properties'
import { JsonRpcSigner, TransactionRequest } from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import Notify, { InitOptions, TransactionEvent } from 'bnc-notify'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext } from 'react'

import { emitErrorNotification } from 'utils/notifications'

import * as Sentry from '@sentry/browser'
import { t } from '@lingui/macro'

type TransactorCallback = (e?: TransactionEvent, signer?: JsonRpcSigner) => void

type TransactorOptions = {
  value?: BigNumberish
  onDone?: VoidFunction
  onConfirmed?: TransactorCallback
  onCancelled?: TransactorCallback
  onError?: ErrorCallback
}

export type Transactor = (
  contract: Contract,
  functionName: string,
  args: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: TransactorOptions,
) => Promise<boolean>

export type TransactorInstance<T> = (
  args: T,
  txOpts?: Omit<TransactorOptions, 'value'>,
) => ReturnType<Transactor>

// Check user has their wallet connected. If not, show select wallet prompt
const checkWalletConnected = (
  onSelectWallet: VoidFunction,
  userAddress?: string,
) => {
  if (!userAddress && onSelectWallet) {
    onSelectWallet()
  }
}

// wrapper around BlockNative's Notify.js
// https://docs.blocknative.com/notify
export function useTransactor({
  gasPrice,
}: {
  gasPrice?: BigNumber
}): Transactor | undefined {
  const {
    signingProvider: provider,
    onSelectWallet,
    userAddress,
  } = useContext(NetworkContext)

  const { isDarkMode } = useContext(ThemeContext)

  return useCallback(
    async (
      contract: Contract,
      functionName: string,
      args: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
      options?: TransactorOptions,
    ) => {
      if (!onSelectWallet) return false

      if (!provider) {
        onSelectWallet()
        if (options?.onDone) options.onDone()
        return false
      }

      checkWalletConnected(onSelectWallet, userAddress)

      if (!provider) return false

      const signer = provider.getSigner()

      const network = await provider.getNetwork()

      const notifyOpts: InitOptions = {
        dappId: process.env.REACT_APP_BLOCKNATIVE_API_KEY,
        system: 'ethereum',
        networkId: network.chainId,
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
      if (network.name && network.chainId > 1) {
        etherscanNetwork = network.name + '.'
      }

      let etherscanTxUrl = 'https://' + etherscanNetwork + 'etherscan.io/tx/'
      if (network.chainId === 100) {
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
          [1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0

        if (isNotifyNetwork) {
          const { emitter } = notify.hash(result.hash)
          emitter.on('all', transaction => ({
            onclick: () => window.open(etherscanTxUrl + transaction.hash),
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
        }

        emitErrorNotification(t`Transaction failed`, { description })

        options?.onDone?.()

        return false
      }
    },
    [onSelectWallet, provider, isDarkMode, gasPrice, userAddress],
  )
}
