import { t } from '@lingui/macro'
import { Modal, ModalProps } from 'antd'
import { PropsWithChildren } from 'react'

import ExternalLink from './ExternalLink'

type TransactionModalProps = PropsWithChildren<
  ModalProps & {
    transactionPending?: boolean
  }
>

const PendingTransactionModalBody = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5rem 0',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '50%' }}>
        <img
          src="/assets/quint.gif"
          alt="Juicebox loading animation"
          style={{ maxWidth: 100, marginBottom: '1rem' }}
        />
        <h3>Transaction pending...</h3>
        <p>Your transaction has been submitted and is awaiting confirmation.</p>
        <ExternalLink href="">View transaction on Etherscan</ExternalLink>
      </div>
    </div>
  )
}

export default function TransactionModal(props: TransactionModalProps) {
  const modalProps = {
    ...props,
    ...{ confirmLoading: props.transactionPending, cancelText: t`Close` },
  }
  delete modalProps.transactionPending
  if (props.transactionPending) {
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
