import { t, Trans } from '@lingui/macro'
import { Modal, ModalProps } from 'antd'
import { readNetwork } from 'constants/networks'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { TxStatus } from 'models/transaction'
import Image from 'next/image'
import { PropsWithChildren, useContext, useMemo } from 'react'
import EtherscanLink from '../EtherscanLink'

type TransactionModalProps = PropsWithChildren<
  ModalProps & {
    transactionPending?: boolean
    connectWalletText?: string
    switchNetworkText?: string
  }
>

const PendingTransactionModalBody = () => {
  const { transactions } = useContext(TxHistoryContext)

  const pendingTx = transactions?.find(tx => tx.status === TxStatus.pending)
  const pendingTxHash = pendingTx?.tx?.hash

  return (
    <div className="my-8 mx-0 flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center text-center font-normal">
        <Image
          src="/assets/images/orange-loading.webp"
          alt={t`Juicebox loading animation`}
          width={260}
          height={260}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
        <h2 className="mt-4 font-heading text-2xl font-medium text-black dark:text-slate-100">
          <Trans>Transaction pending...</Trans>
        </h2>
        <p>
          <Trans>
            Your transaction has been submitted and is awaiting confirmation.
          </Trans>
        </p>
        {pendingTxHash ? (
          <p>
            <EtherscanLink value={pendingTxHash} type="tx">
              <Trans>View on Etherscan</Trans>
            </EtherscanLink>
          </p>
        ) : null}
      </div>
    </div>
  )
}

/**
 * A thin wrapper around antd Modal for ETH transactions.
 * When transactionPending prop is true, the Modal children
 * are replaced with a juicy loading state.
 */
export default function TransactionModal(props: TransactionModalProps) {
  const { isConnected, chainUnsupported } = useWallet()
  const okText = useMemo(() => {
    if (chainUnsupported) {
      return (
        props.switchNetworkText ?? t`Switch network to ${readNetwork.label}`
      )
    }
    if (!isConnected) {
      return props.connectWalletText ?? t`Connect wallet`
    }
    return props.okText
  }, [
    chainUnsupported,
    isConnected,
    props.connectWalletText,
    props.okText,
    props.switchNetworkText,
  ])
  const modalProps = {
    ...props,
    ...{
      confirmLoading: props.transactionPending || props.confirmLoading,
      cancelText: props.cancelText ?? t`Close`,
      okButtonProps: {
        ...props.okButtonProps,
      },
      okText: okText,
      zIndex: 1,
    },
  }

  return (
    <Modal {...modalProps}>
      {props.transactionPending ? (
        <PendingTransactionModalBody />
      ) : (
        props.children
      )}
    </Modal>
  )
}
