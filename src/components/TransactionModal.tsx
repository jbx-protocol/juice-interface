import { t, Trans } from '@lingui/macro'
import { Modal, ModalProps } from 'antd'
import { readNetwork } from 'constants/networks'
import { ThemeContext } from 'contexts/themeContext'
import { TxHistoryContext } from 'contexts/txHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { TxStatus } from 'models/transaction'
import Image from 'next/image'
import { PropsWithChildren, useContext, useMemo } from 'react'
import EtherscanLink from './EtherscanLink'
import quint from '/public/assets/quint.gif'

type TransactionModalProps = PropsWithChildren<
  ModalProps & {
    transactionPending?: boolean
    connectWalletText?: string
    switchNetworkText?: string
  }
>

const PendingTransactionModalBody = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { transactions } = useContext(TxHistoryContext)

  const pendingTx = transactions?.find(tx => tx.status === TxStatus.pending)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2rem 0',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <Image
          src={quint}
          alt={t`Juicebox loading animation`}
          style={{ maxWidth: 100, marginBottom: '1rem' }}
        />
        <h2 style={{ color: colors.text.primary }}>
          <Trans>Transaction pending...</Trans>
        </h2>
        <p>
          <Trans>
            Your transaction has been submitted and is awaiting confirmation{' '}
            {pendingTx ? (
              <EtherscanLink value={pendingTx.tx?.hash} type="tx" />
            ) : null}
          </Trans>
        </p>
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
      cancelText: t`Close`,
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
