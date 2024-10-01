import { ToolOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import CopyTextButton from 'components/buttons/CopyTextButton'
import { Callout } from 'components/Callout/Callout'
import EtherscanLink from 'components/EtherscanLink'
import TransactionModal from 'components/modals/TransactionModal'
import { PROJECT_PAYER_ADDRESS_EXPLANATION } from 'components/strings'
import { providers } from 'ethers'
import { useState } from 'react'
import AdvancedOptionsCollapse from './AdvancedOptionsCollapse'

const DEPLOY_EVENT_IDX = 0

/**
 * Return the address of the project payer created from a `deployProjectPayer` transaction.
 * @param txReceipt receipt of `deployProjectPayer` transaction
 */
const getProjectPayerAddressFromReceipt = (
  txReceipt: providers.TransactionReceipt,
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
  open,
  onClose,
  onConfirmed,
}: {
  open: boolean
  onClose: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const [loadingProjectPayer, setLoadingProjectPayer] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [projectPayerAddress, setProjectPayerAddress] = useState<string>()

  const [advancedOptionsForm] = useForm<AdvancedOptionsFields>()

  const [confirmedModalVisible, setConfirmedModalVisible] = useState<boolean>()

  // const deployProjectPayerTx = useDeployProjectPayerTx()

  // async function deployProjectPayer() {
  //   if (!deployProjectPayerTx) return

  //   setLoadingProjectPayer(true)

  //   const fields = advancedOptionsForm.getFieldsValue(true)
  //   const memo = [fields.memo ?? '', fields.memoImageUrl ?? ''].join(' ').trim()

  //   const txSuccess = await deployProjectPayerTx(
  //     {
  //       customBeneficiaryAddress: fields.customBeneficiaryAddress,
  //       customMemo: memo.length > 0 ? memo : undefined,
  //       tokenMintingEnabled: fields.tokenMintingEnabled,
  //       preferClaimed: fields.preferClaimed,
  //     },
  //     {
  //       onDone() {
  //         setTransactionPending(true)
  //       },
  //       async onConfirmed(tx) {
  //         const txHash = tx?.hash
  //         if (!txHash) {
  //           return
  //         }

  //         const txReceipt = await readProvider.getTransactionReceipt(txHash)
  //         const newProjectPayerAddress =
  //           getProjectPayerAddressFromReceipt(txReceipt)
  //         if (newProjectPayerAddress === undefined) {
  //           emitErrorNotification(t`Something went wrong.`)
  //           return
  //         }
  //         if (onConfirmed) onConfirmed()
  //         onClose()
  //         setProjectPayerAddress(newProjectPayerAddress)
  //         setLoadingProjectPayer(false)
  //         setTransactionPending(false)
  //         setConfirmedModalVisible(true)
  //         advancedOptionsForm.resetFields()
  //       },
  //     },
  //   )
  //   if (!txSuccess) {
  //     setLoadingProjectPayer(false)
  //     setTransactionPending(false)
  //   }
  // }

  return (
    <>
      <TransactionModal
        open={open}
        title={t`Create a project payer address`}
        okText={t`Create project payer address`}
        connectWalletText={t`Connect wallet to deploy`}
        onOk={() => null}//deployProjectPayer}
        onCancel={() => onClose()}
        confirmLoading={loadingProjectPayer}
        transactionPending={transactionPending}
        width={600}
      >
        <div className="flex flex-col gap-4">
          <div>{PROJECT_PAYER_ADDRESS_EXPLANATION}</div>
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
          <Trans>Your new project payer address:</Trans>
        </h4>
        <EtherscanLink
          className="text-base"
          value={projectPayerAddress}
          type="address"
        />{' '}
        <CopyTextButton className="text-2xl" value={projectPayerAddress} />
        <p className="mt-7">
          <Trans>
            Existing project payer addresses can be found in the Tools drawer (
            <ToolOutlined />) on the project page.
          </Trans>
        </p>
      </Modal>
    </>
  )
}
