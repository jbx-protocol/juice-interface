import { t, Trans } from '@lingui/macro'
import { useContext, useState } from 'react'

import { TransactionReceipt } from '@ethersproject/providers'
import { TransactorInstance } from 'hooks/Transactor'

import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import EtherscanLink from 'components/EtherscanLink'
import CopyTextButton from 'components/CopyTextButton'
import TransactionModal from 'components/TransactionModal'
import { DeployProjectPayerTxArgs } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { emitErrorNotification } from 'utils/notifications'
import { NetworkContext } from 'contexts/networkContext'

import { readProvider } from 'constants/readProvider'

import AdvancedOptionsCollapse from './AdvancedOptionsCollapse'

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
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
  onConfirmed?: VoidFunction
}) {
  const { userAddress } = useContext(NetworkContext)

  const [loadingProjectPayer, setLoadingProjectPayer] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [projectPayerAddress, setProjectPayerAddress] = useState<string>()

  const [tokenMintingEnabled, setTokenMintingEnabled] = useState<boolean>(true)
  const [preferClaimed, setPreferClaimed] = useState<boolean>(false)

  const [form] = useForm<{
    memo: string
    customBeneficiaryAddress: string
  }>()

  const [confirmedModalVisible, setConfirmedModalVisible] = useState<boolean>()
  // TODO: load project payer and show different thing in this section if the project already has one
  // (Issue: #897)

  const deployProjectPayerTx = useDeployProjectPayerTx()

  async function deployProjectPayer() {
    if (!deployProjectPayerTx) return

    setLoadingProjectPayer(true)

    const txSuccess = await deployProjectPayerTx(
      {
        customBeneficiaryAddress: form.getFieldValue(
          'customBeneficiaryAddress',
        ),
        customMemo: form.getFieldValue('memo'),
        tokenMintingEnabled,
        preferClaimed,
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
            emitErrorNotification(t`Something went wrong.`)
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
    form.resetFields()
  }

  return (
    <>
      <TransactionModal
        visible={visible}
        title={t`Create payment address`}
        okText={t`Deploy payment address contract`}
        connectWalletText={t`Connect wallet to deploy`}
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
            Tokens minted from payments to this address will belong to the payer
            by default. However, if someone pays the project through a custodial
            service platform such as Coinbase,{' '}
            <strong>
              tokens can't be issued to their personal wallets and will be lost
            </strong>
            .
          </Trans>
        </p>
        {/* TODO: we should consider reworking this */}
        {/* Form that controls internals of the AdvancedOptionsCollapse */}
        <Form
          form={form}
          initialValues={{ customBeneficiaryAddress: userAddress }}
        >
          <AdvancedOptionsCollapse
            tokenMintingEnabled={tokenMintingEnabled}
            setTokenMintingEnabled={setTokenMintingEnabled}
            preferClaimed={preferClaimed}
            setPreferClaimed={setPreferClaimed}
          />
        </Form>
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
            Deployed payment addresses can be found in the Tools drawer on the
            project page.
          </Trans>
        </p>
      </Modal>
    </>
  )
}
