import { BigNumber } from '@ethersproject/bignumber'
import { hexlify } from '@ethersproject/bytes'
import { Deferrable } from '@ethersproject/properties'
import {
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionRequest,
  Web3Provider,
} from '@ethersproject/providers'
import { parseUnits } from '@ethersproject/units'
import Notify, { InitOptions, TransactionEvent } from 'bnc-notify'

import { Transactor } from '../models/transactor'

// wrapper around BlockNative's Notify.js
// https://docs.blocknative.com/notify
export function createTransactor({
  provider,
  gasPrice,
}: {
  provider?: Web3Provider | JsonRpcProvider
  gasPrice?: BigNumber
}): Transactor | undefined {
  if (!provider) return

  return async (
    tx: Deferrable<TransactionRequest>,
    onConfirmed?: (e?: TransactionEvent, signer?: JsonRpcSigner) => void,
    onCancelled?:
      | ((e?: TransactionEvent, signer?: JsonRpcSigner) => void)
      | boolean,
  ) => {
    const signer = provider.getSigner()

    const network = await provider.getNetwork()

    const options: InitOptions = {
      dappId: '2f161484-1dae-4684-b0db-6ff7c4470e2e', // https://account.blocknative.com
      system: 'ethereum',
      networkId: network.chainId,
      // darkMode: Boolean, // (default: false)
      transactionHandler: txInformation => {
        console.log('HANDLE TX', txInformation)
        if (onConfirmed && txInformation.transaction.status === 'confirmed')
          onConfirmed(txInformation, signer)
        if (onCancelled && txInformation.transaction.status === 'cancelled') {
          if (onCancelled === true) {
            if (onConfirmed) onConfirmed(txInformation, signer)
          } else {
            onCancelled(txInformation, signer)
          }
        }
      },
    }
    const notify = Notify(options)

    let etherscanNetwork = ''
    if (network.name && network.chainId > 1) {
      etherscanNetwork = network.name + '.'
    }

    let etherscanTxUrl = 'https://' + etherscanNetwork + 'etherscan.io/tx/'
    if (network.chainId === 100) {
      etherscanTxUrl = 'https://blockscout.com/poa/xdai/tx/'
    }

    try {
      let result
      if (tx instanceof Promise) {
        console.log('AWAITING TX', tx)
        result = await tx
      } else {
        if (!tx.gasPrice) tx.gasPrice = gasPrice ?? parseUnits('4.1', 'gwei')

        if (!tx.gasLimit) tx.gasLimit = hexlify(120000)

        console.log('RUNNING TX', tx)
        result = await signer.sendTransaction(tx)
      }
      console.log('RESULT:', result)
      // console.log("Notify", notify);

      // if it is a valid Notify.js network, use that, if not, just send a default notification
      const isNotifyNetwork =
        [1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0

      if (isNotifyNetwork) {
        const { emitter } = notify.hash(result.hash)
        emitter.on('all', transaction => ({
          onclick: () => window.open(etherscanTxUrl + transaction.hash),
        }))
      } else {
        console.log('LOCAL TX SENT', result.hash)
        if (result.confirmations) {
          if (onConfirmed) onConfirmed(result, undefined)
        } else {
          if (onCancelled === true) {
            if (onConfirmed) onConfirmed(result, undefined)
          } else if (onCancelled) {
            onCancelled(result, undefined)
          }
        }
      }

      return true
    } catch (e) {
      console.log('Transaction Error:', e.message)
      return false
    }
  }
}
