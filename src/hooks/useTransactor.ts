import { t } from '@lingui/macro'
import { writeContract } from '@usekeyp/js-sdk'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { useArcx } from 'contexts/Arcx/useArcx'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { BigNumber, BigNumberish, Contract } from 'ethers'
import { FunctionFragment, Interface } from 'ethers/lib/utils'
import { simulateTransaction } from 'lib/tenderly'
import { TransactionLog, TransactionOptions } from 'models/transaction'
import { CV2V3 } from 'models/v2v3/cv'
import { useCallback, useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { emitErrorNotification } from 'utils/notifications'
import { useJBWallet } from './Wallet/useJBWallet'

function abiFunctionName(functionName: string, abi: Interface) {
  const fn = abi.fragments.find(
    f => f.type === 'function' && f.name === functionName,
  ) as FunctionFragment

  return `${functionName}(${fn?.inputs
    .map(i => `${i.indexed ? 'indexed ' : ''}${i.type}`)
    .join(',')}) public ${fn?.stateMutability} returns (${fn?.outputs
    ?.map(o => `${o.type}${o.name ? `${o.name}` : ''}`)
    .join(',')})`
}

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

function sendKeypTransaction({
  contract,
  functionName,
  args,
  accessToken,
  value,
}: {
  contract: Contract
  functionName: string
  args: unknown[]
  accessToken: string
  value?: BigNumberish
}) {
  const { address } = contract

  function flattenArg(a: unknown): string {
    switch (typeof a) {
      case 'string':
        return a
      case 'number':
      case 'boolean':
        return a.toString()
    }

    if (a === undefined || a === null) return a as unknown as string

    if (BigNumber.isBigNumber(a)) return a.toHexString()

    if (Array.isArray(a)) return a.map(flattenArg) as unknown as string

    return Object.entries(a).reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: flattenArg(v),
      }),
      {},
    ) as unknown as string // lol

    // return Object.values(a).map(flattenArg).join(',')
  }

  const _args = args.map(flattenArg)

  const opts = {
    accessToken,
    address,
    abi: abiFunctionName(functionName, contract.interface),
    args: _args,
    ...(value ? { value: BigNumber.from(value).toHexString() } : {}),
  }

  const log = [
    `functionName=${functionName}`,
    `contractAddress=${address}`,
  ].join('\n')

  console.info(
    `🧃 Transactor::sending keyp transaction => \n${log}\nargs=`,
    opts,
  )

  return writeContract(opts)
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

  const { eoa, keyp, isConnected, userAddress, connect } = useJBWallet()
  const { chainUnsupported, signer, chain, changeNetworks } = eoa

  const arcx = useArcx()

  return useCallback(
    async (
      contract: Contract,
      functionName: string,
      args: unknown[],
      options?: TransactionOptions,
    ) => {
      const { accessToken, isAuthenticated } = keyp
      const { onCancelled, onConfirmed, onDone, onError } = options ?? {}

      if (chainUnsupported) {
        await changeNetworks()
        onDone?.()
        return false
      }
      if (!isConnected && connect) {
        await connect()
        onDone?.()
        return false
      }
      if (!accessToken && (!signer || !chain)) {
        // this checks the properties required for a transaction, instead of just eoa.isConnected/keyp.isAuthenticated. this block should probably never be reached
        onDone?.()
        return false
      }

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
        let result: TransactionLog['tx'] | undefined = undefined

        console.log('asdf', isAuthenticated, accessToken)

        if (isAuthenticated) {
          if (accessToken) {
            console.log('asdf0', { args })
            result = await sendKeypTransaction({
              contract,
              functionName,
              args,
              accessToken,
              value: options?.value,
            })
            console.log('asdf1')
          } else {
            onError?.(new DOMException('Keyp authentication error'))
          }
        } else {
          result = await prepareTransaction({
            functionName,
            contract,
            args,
            options,
          })
        }

        // transaction was submitted, but not confirmed/mined yet.
        console.info('✅ Transactor::submitted', result)
        onDone?.()

        const txTitle = options?.title ?? functionName

        // add transaction to the history UI
        if (result) {
          addTransaction?.(txTitle, result, {
            onConfirmed,
            onCancelled,
          })
        }

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

        let description: string
        try {
          let json = message.split('(error=')[1]
          json = json.split(', method=')[0]
          description = JSON.parse(json).message || message
          onError?.(new DOMException(description))
        } catch (_) {
          description = message
          onError?.(new DOMException(description))
          emitErrorNotification(t`Transaction failed`, { description })
        }

        onDone?.()

        return false
      }
    },
    [
      keyp,
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
