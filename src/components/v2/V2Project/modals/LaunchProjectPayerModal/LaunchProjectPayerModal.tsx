import { ToolOutlined } from '@ant-design/icons'
import { TransactionReceipt } from '@ethersproject/providers'
import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Callout from 'components/Callout'
import CopyTextButton from 'components/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import TransactionModal from 'components/TransactionModal'
import { readProvider } from 'constants/readProvider'
import { TransactorInstance } from 'hooks/Transactor'
import { DeployProjectPayerTxArgs } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
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

export interface AdvancedOptionsFields {
  memo: string
  memoImageUrl: string | undefined
  tokenMintingEnabled: boolean
  customBeneficiaryAddress: string | undefined
  preferClaimed: boolean
}

export function LaunchProjectPayerModal({
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
  const [loadingProjectPayer, setLoadingProjectPayer] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [projectPayerAddress, setProjectPayerAddress] = useState<string>()

  const [advancedOptionsForm] = useForm<AdvancedOptionsFields>()

  const [confirmedModalVisible, setConfirmedModalVisible] = useState<boolean>()

  const deployProjectPayerTx = useDeployProjectPayerTx()

  async function deployProjectPayer() {
    if (!deployProjectPayerTx) return

    setLoadingProjectPayer(true)

    const fields = advancedOptionsForm.getFieldsValue(true)

    const txSuccess = await deployProjectPayerTx(
      {
        customBeneficiaryAddress: fields.customBeneficiaryAddress,
        customMemo: `${fields.memo} ${fields.memoImageUrl ?? ''}`,
        tokenMintingEnabled: fields.tokenMintingEnabled,
        preferClaimed: fields.preferClaimed,
      },
      {
        onDone() {
          setTransactionPending(true)
        },
        async onConfirmed(tx) {
          const txHash = tx?.hash
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
          advancedOptionsForm.resetFields()
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
        title={t`Create Payment Address`}
        okText={t`Deploy Payment Address contract`}
        connectWalletText={t`Connect wallet to deploy`}
        onOk={deployProjectPayer}
        onCancel={() => onClose()}
        confirmLoading={loadingProjectPayer}
        transactionPending={transactionPending}
        width={600}
      >
        <Space direction="vertical" size="middle">
          <div>
            <Trans>
              Create an Ethereum address that can be used to pay your project
              directly.
            </Trans>
          </div>
          <div>
            <Trans>
              By default, the payer will receive any project tokens minted from
              the payment.
            </Trans>
          </div>

          <Callout>
            <Trans>
              Contributors who pay this address from a custodial service
              platform (like Coinbase){' '}
              <strong>won't receive project tokens</strong>.
            </Trans>
          </Callout>
          <AdvancedOptionsCollapse form={advancedOptionsForm} />
        </Space>
      </TransactionModal>
      <Modal
        visible={confirmedModalVisible}
        onOk={() => setConfirmedModalVisible(false)}
        cancelButtonProps={{ hidden: true }}
        okText={t`Done`}
        centered
      >
        <h4 style={{ marginBottom: 30 }}>
          <Trans>Your new payment address:</Trans>
        </h4>
        <EtherscanLink
          value={projectPayerAddress}
          style={{ fontSize: 15 }}
          type="address"
        />{' '}
        <CopyTextButton value={projectPayerAddress} style={{ fontSize: 25 }} />
        <p style={{ marginTop: 30 }}>
          <Trans>
            Deployed payment addresses can be found in the Tools drawer (
            <ToolOutlined />) on the project page.
          </Trans>
        </p>
      </Modal>
    </>
  )
}
