import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import CopyTextButton from 'components/buttons/CopyTextButton'
import { Callout } from 'components/Callout'
import EtherscanLink from 'components/EtherscanLink'
import { SPLITS_PAYER_ADDRESS_EXPLANATION } from 'components/Explanations'
import TransactionModal from 'components/TransactionModal'
import { readProvider } from 'constants/readProvider'
import { providers } from 'ethers'
import { useDeploySplitsPayerTx } from 'hooks/v2v3/transactor/DeploySplitsPayerTx'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import AdvancedOptionsCollapse from '../../modals/LaunchProjectPayerModal/AdvancedOptionsCollapse'
import { AdvancedOptionsFields } from '../../modals/LaunchProjectPayerModal/LaunchProjectPayerModal'

const DEPLOY_EVENT_IDX = 0

/**
 * Return the address of the splits payer created from a `deploySplitsPayer` transaction.
 * @param txReceipt receipt of `deploySplitsPayer` transaction
 */
const getSplitsPayerAddressFromReceipt = (
  txReceipt: providers.TransactionReceipt,
): string => {
  const newSplitsPayerAddress = txReceipt?.logs[DEPLOY_EVENT_IDX]?.address
  return newSplitsPayerAddress
}

export function LaunchSplitsPayerModal({
  open,
  onClose,
  onConfirmed,
}: {
  open: boolean
  onClose: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const [loadingSplitsPayer, setLoadingSplitsPayer] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [splitsPayerAddress, setSplitsPayerAddress] = useState<string>()

  const [advancedOptionsForm] = useForm<AdvancedOptionsFields>()

  const [confirmedModalVisible, setConfirmedModalVisible] = useState<boolean>()

  const deploySplitsPayerTx = useDeploySplitsPayerTx()

  async function deploySplitsPayer() {
    if (!deploySplitsPayerTx) return

    setLoadingSplitsPayer(true)

    const fields = advancedOptionsForm.getFieldsValue(true)
    const memo = [fields.memo ?? '', fields.memoImageUrl ?? ''].join(' ').trim()

    const txSuccess = await deploySplitsPayerTx(
      {
        customBeneficiaryAddress: fields.customBeneficiaryAddress,
        customMemo: memo.length > 0 ? memo : undefined,
        tokenMintingEnabled: fields.tokenMintingEnabled,
        preferClaimed: fields.preferClaimed ?? false,
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
          const newSplitsPayerAddress =
            getSplitsPayerAddressFromReceipt(txReceipt)
          if (newSplitsPayerAddress === undefined) {
            emitErrorNotification(t`Something went wrong.`)
            return
          }
          if (onConfirmed) onConfirmed()
          onClose()
          setSplitsPayerAddress(newSplitsPayerAddress)
          setLoadingSplitsPayer(false)
          setTransactionPending(false)
          setConfirmedModalVisible(true)
          advancedOptionsForm.resetFields()
        },
      },
    )
    if (!txSuccess) {
      setLoadingSplitsPayer(false)
      setTransactionPending(false)
    }
  }

  return (
    <>
      <TransactionModal
        open={open}
        title={t`Create a splits payer address`}
        okText={t`Create splits payer address`}
        connectWalletText={t`Connect wallet to deploy`}
        onOk={deploySplitsPayer}
        onCancel={() => onClose()}
        confirmLoading={loadingSplitsPayer}
        transactionPending={transactionPending}
        width={600}
      >
        <div className="flex flex-col gap-4">
          <div>{SPLITS_PAYER_ADDRESS_EXPLANATION}</div>
          <div>
            <Trans>
              By default, the payer will receive any project tokens minted from
              the payment.
            </Trans>
          </div>

          <Callout.Info>
            <Trans>
              Contributors who pay this address from a custodial service
              platform (like Coinbase){' '}
              <strong>won't receive project tokens</strong>.
            </Trans>
          </Callout.Info>
          <AdvancedOptionsCollapse form={advancedOptionsForm} />
        </div>
      </TransactionModal>
      <Modal
        open={confirmedModalVisible}
        onOk={() => setConfirmedModalVisible(false)}
        cancelButtonProps={{ hidden: true }}
        okText={t`Done`}
        centered
      >
        <h4 className="mb-7">
          <Trans>Your new splits payer address:</Trans>
        </h4>
        <EtherscanLink
          className="text-base"
          value={splitsPayerAddress}
          type="address"
        />{' '}
        <CopyTextButton className="text-2xl" value={splitsPayerAddress} />
        <p className="mt-7">
          You MUST store this address yourself now.
          {/* TODO: JB-161 */}
          {/* <Trans>
            Existing splits payer addresses can be found in the Tools drawer (
            <ToolOutlined />) on the project page.
          </Trans> */}
        </p>
      </Modal>
    </>
  )
}
