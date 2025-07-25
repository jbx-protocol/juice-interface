import { Contract } from '@ethersproject/contracts'
import * as providers from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { simulateTransaction } from 'lib/tenderly'
import { TransactionOptions } from 'models/transaction'
import { CV2V3 } from 'packages/v2v3/models/cv'
import { useCallback, useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import {
  emitErrorNotification,
  emitInfoNotification,
} from 'utils/notifications'
import { useWallet } from './Wallet'

type TxOpts = Omit<TransactionOptions, 'value'>

function logTx({
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
  const reportArgs = Object.values(contract.interface.functions)
    .find(f => f.name === functionName)
    ?.inputs.reduce(
      (acc, input, i) => ({
        ...acc,
        [input.name]: args[i],
      }),
      {
        value: options?.value,
      },
    )

  const log = [
    `functionName=${functionName}`,
    `contractAddress=${contract.address}`,
  ].join('\n')

  console.info(
    `🧃 Transactor::submitting transaction => \n${log}\nargs=`,
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

  const { chain, userAddress } = useWallet()
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()
  const { eip1193Provider } = useWallet()

  return useCallback(
    async (
      _contract: Contract,
      functionName: string,
      args: unknown[],
      options?: TransactionOptions,
    ) => {
      if (chainUnsupported) {
        await changeNetworks()
        emitInfoNotification(
          t`Your wallet has been changed to ${readNetwork.name}. Try transaction again.`,
        )
        options?.onDone?.()
        return false
      }
      if (!isConnected) {
        await connect()
        options?.onDone?.()
        return false
      }
      if (!eip1193Provider || !chain) {
        options?.onDone?.()
        return false
      }

      /**
       * Create a new contract instance with the provider.
       */
      const provider = new providers.Web3Provider(eip1193Provider as providers.ExternalProvider)
      const signer = provider.getSigner()
      const contract = new Contract(
        _contract.address,
        _contract.interface,
        signer,
      )

      logTx({ functionName, contract, args, options })

      if (
        process.env.NODE_ENV === 'development' ||
        featureFlagEnabled(FEATURE_FLAGS.SIMULATE_TXS)
      ) {
        try {
          await simulateTransaction({
            contract,
            functionName,
            args,
            userAddress,
            options,
          })
        } catch (e) {
          console.warn('Simulation failed', e)
        }
      }

      try {
        const tx = prepareTransaction({ functionName, contract, args, options })
        const result: providers.TransactionResponse = await tx

        console.info('✅ Transactor::submitted', result)

        // transaction was submitted, but not confirmed/mined yet.
        options?.onDone?.()

        // add transaction to the history UI
        const txTitle = options?.title ?? functionName
        addTransaction?.(
          txTitle,
          {
            hash: result.hash as `0x${string}`,
            timestamp: result.timestamp,
          },
          {
            onConfirmed: options?.onConfirmed,
            onCancelled: options?.onCancelled,
          },
        )

        return true
      } catch (e) {
        const message = (e as Error).message

        console.error('Transactor::error', message)

        let description: string
        try {
          let json = message.split('(error=')[1]
          json = json.split(', method=')[0]
          description = JSON.parse(json).message || message
          options?.onError?.(new DOMException(description))
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
      eip1193Provider,
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
  cv: '1' | CV2V3 | undefined
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
