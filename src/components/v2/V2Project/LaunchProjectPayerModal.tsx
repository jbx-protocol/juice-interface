import { t, Trans } from '@lingui/macro'
import { useState } from 'react'

import { TransactionReceipt } from '@ethersproject/providers'
import { TransactorInstance } from 'hooks/Transactor'

import { Modal, notification } from 'antd'
import { JBDiscordLink } from 'components/Landing/QAs'
import EtherscanLink from 'components/shared/EtherscanLink'
import CopyTextButton from 'components/shared/CopyTextButton'

import { readProvider } from 'constants/readProvider'
import TransactionModal from '../../shared/TransactionModal'

const DEPLOY_EVENT_IDX = 0

/**
 * Return the address of the project payer created from a `deployProjectPayer` transaction.
 * @param txReceipt receipt of `deployProjectPayer` transaction
 */
const getProjectPayerAddressFromReceipt = (
  txReceipt: TransactionReceipt,
): string => {
  const newProjectPayerAddress = txReceipt?.logs[DEPLOY_EVENT_IDX]?.address
  return newProjectPayerAddress
}
export default function LaunchProjectPayerModal({
  visible,
  onClose,
  useDeployProjectPayerTx,
  onConfirmed,
}: {
  visible: boolean
  onClose: VoidFunction
  useDeployProjectPayerTx: () => TransactorInstance<{}> | undefined
  onConfirmed?: VoidFunction
}) {
  const [loadingProjectPayer, setLoadingProjectPayer] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [projectPayerAddress, setProjectPayerAddress] = useState<string>()

  const [confirmedModalVisible, setConfirmedModalVisible] = useState<boolean>()
  // TODO: load project payer and show different thing in this section if the project already has one
  // (Issue: #897)

  const deployProjectPayerTx = useDeployProjectPayerTx()

  async function deployProjectPayer() {
    if (!deployProjectPayerTx) return

    setLoadingProjectPayer(true)

    const txSuccess = await deployProjectPayerTx(
      {
        args: [],
      },
      {
        onDone() {
          setTransactionPending(true)
        },
        async onConfirmed(result) {
          const txHash = result?.transaction?.hash
          if (!txHash) {
            return
          }

          const txReceipt = await readProvider.getTransactionReceipt(txHash)
          const newProjectPayerAddress =
            getProjectPayerAddressFromReceipt(txReceipt)
          if (newProjectPayerAddress === undefined) {
            notification.error({
              key: new Date().valueOf().toString(),
              message: t`Something went wrong.`,
              duration: 0,
            })
            return
          }
          if (onConfirmed) onConfirmed()
          onClose()
          setProjectPayerAddress(newProjectPayerAddress)
          setLoadingProjectPayer(false)
          setTransactionPending(false)
          setConfirmedModalVisible(true)
        },
      },
    )
    if (!txSuccess) {
      setLoadingProjectPayer(false)
      setTransactionPending(false)
    }
  }

  return (
    <>
      <TransactionModal
        visible={visible}
        title={t`Create payable address`}
        okText={t`Deploy project payer contract`}
        onOk={deployProjectPayer}
        onCancel={() => onClose()}
        confirmLoading={loadingProjectPayer}
        transactionPending={transactionPending}
      >
        <p>
          <Trans>
            Create an Ethereum address that can be used to pay your project
            directly.
          </Trans>
        </p>
        <p>
          <Trans>
            Tokens minted from payments to this address will belong to the
            payer. However, if someone pays the project from a non-custodial
            entity like the Coinbase app,{' '}
            <strong>
              tokens can't be issued to their personal wallets and will be lost
            </strong>
            .
          </Trans>
        </p>
      </TransactionModal>
      <Modal
        visible={confirmedModalVisible}
        onOk={() => setConfirmedModalVisible(false)}
        cancelButtonProps={{ hidden: true }}
        okText={t`Done`}
        centered
      >
        <h4 style={{ marginBottom: 30 }}>
          <Trans>Your new payable address:</Trans>
        </h4>
        <EtherscanLink
          value={projectPayerAddress}
          style={{ fontSize: 15 }}
          type="address"
        />
        <CopyTextButton value={projectPayerAddress} style={{ fontSize: 25 }} />
        <p style={{ marginTop: 30 }}>
          <Trans>
            This address will disappear when you close this window.{' '}
            <strong>Copy the address and save it now</strong>.
          </Trans>
        </p>
        <p>
          <Trans>
            If you lose your address, please contact the Juicebox team through{' '}
            <JBDiscordLink>Discord</JBDiscordLink>.
          </Trans>
        </p>
      </Modal>
    </>
  )
}
