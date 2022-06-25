import { t, Trans } from '@lingui/macro'
import { Modal, ModalProps } from 'antd'
import { NetworkContext } from 'contexts/networkContext'

import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'

type TransactionModalProps = PropsWithChildren<
  ModalProps & {
    transactionPending?: boolean
    connectWalletText?: string
  }
>

const PendingTransactionModalBody = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
        <img
          src="/assets/quint.gif"
          alt={t`Juicebox loading animation`}
          style={{ maxWidth: 100, marginBottom: '1rem' }}
        />
        <h2 style={{ color: colors.text.primary }}>
          <Trans>Transaction pending...</Trans>
        </h2>
        <p>
          <Trans>
            Your transaction has been submitted and is awaiting confirmation.
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
  const { userAddress } = useContext(NetworkContext)
  const okText = userAddress
    ? props.okText
    : props.connectWalletText ?? t`Connect wallet`
  const modalProps = {
    ...props,
    ...{
      confirmLoading: props.transactionPending || props.confirmLoading,
      cancelText: t`Close`,
      okButtonProps: {
        ...props.okButtonProps,
        disabled: !userAddress,
      },
      okText: okText,
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
