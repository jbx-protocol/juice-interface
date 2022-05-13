import { t, Trans } from '@lingui/macro'
import { useContext, useState } from 'react'

import { TransactionReceipt } from '@ethersproject/providers'
import { TransactorInstance } from 'hooks/Transactor'

import { Collapse, Form, Input, Modal, notification, Switch } from 'antd'
import { JBDiscordLink } from 'components/Landing/QAs'
import EtherscanLink from 'components/shared/EtherscanLink'
import CopyTextButton from 'components/shared/CopyTextButton'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import * as constants from '@ethersproject/constants'

import TooltipLabel from 'components/shared/TooltipLabel'
import { FormItems } from 'components/shared/formItems'
import { NetworkContext } from 'contexts/networkContext'
import { DeployProjectPayerTxArgs } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useForm } from 'antd/lib/form/Form'

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
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
  onConfirmed?: VoidFunction
}) {
  const { userAddress } = useContext(NetworkContext)
  const { tokenAddress } = useContext(V2ProjectContext)

  const [loadingProjectPayer, setLoadingProjectPayer] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [projectPayerAddress, setProjectPayerAddress] = useState<string>()
  const [activeKey, setActiveKey] = useState<number>()

  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)
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

  const advancedSettingsMargin = '20px'
  const switchMargin = '20px'

  function AdvancedOptionsCollapse() {
    return (
      <Collapse style={{ border: 'none' }} activeKey={activeKey}>
        <CollapsePanel
          header={
            <span onClick={() => setActiveKey(activeKey === 0 ? undefined : 0)}>
              <Trans>Advanced options (optional)</Trans>
            </span>
          }
          key={0}
          style={{ border: 'none', marginLeft: '-18px' }}
        >
          <div
            style={{ paddingLeft: '24px', marginTop: '-15px' }}
            onClick={e => e.stopPropagation()}
          >
            <Form form={form}>
              <div>
                <TooltipLabel
                  label={t`Custom memo`}
                  tip={
                    <Trans>
                      The onchain memo for each transaction made through the
                      address. It will appear in the project's payment feed when
                      someone pays this address.
                    </Trans>
                  }
                />
                <Form.Item name="memo">
                  <Input
                    placeholder={t`Payment made through payable address`}
                    type="string"
                    autoComplete="off"
                    style={{ marginTop: 5 }}
                  />
                </Form.Item>
              </div>
              <div
                style={{ display: 'flex', marginTop: advancedSettingsMargin }}
              >
                <TooltipLabel
                  label={t`Token minting enabled`}
                  tip={t`Determines whether tokens will be minted when people pay to this address.`}
                />
                <Switch
                  onChange={setTokenMintingEnabled}
                  checked={tokenMintingEnabled}
                  style={{ marginLeft: switchMargin }}
                />
              </div>
              {tokenMintingEnabled ? (
                <div
                  style={{
                    display: 'flex',
                    margin: `${advancedSettingsMargin} 0 14px`,
                  }}
                >
                  <TooltipLabel
                    label={t`Custom token beneficiary`}
                    tip={
                      <Trans>
                        By default, newly minted tokens will go to the wallet
                        who sends funds to the address. You can enable this to
                        set the token beneficiary to a custom address.
                      </Trans>
                    }
                  />
                  <Switch
                    onChange={checked => {
                      setCustomBeneficiaryEnabled(checked)
                    }}
                    checked={customBeneficiaryEnabled}
                    style={{ marginLeft: switchMargin }}
                  />
                </div>
              ) : null}
              {tokenMintingEnabled && customBeneficiaryEnabled ? (
                <FormItems.EthAddress
                  name="beneficiary"
                  defaultValue={userAddress}
                  onAddressChange={address => {
                    form.setFieldsValue({
                      customBeneficiaryAddress: address,
                    })
                  }}
                />
              ) : null}
              {tokenAddress && tokenAddress !== constants.AddressZero ? (
                <div
                  style={{ display: 'flex', marginTop: advancedSettingsMargin }}
                >
                  <TooltipLabel
                    label={t`Mint tokens as ERC-20`}
                    tip={
                      <Trans>
                        Checking this will mint this project's ERC-20 tokens to
                        the beneficiary's wallet when they pay to the address,
                        and cost them more gas for each payment. If left
                        unchecked, the beneficiary's new token balance will be
                        tracked by Juicebox when they pay, and they can then
                        claim their ERC-20 tokens later at any time.
                      </Trans>
                    }
                  />
                  <Switch
                    style={{ marginLeft: switchMargin }}
                    checked={preferClaimed}
                    onChange={setPreferClaimed}
                  />
                </div>
              ) : null}
            </Form>
          </div>
        </CollapsePanel>
      </Collapse>
    )
  }

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
    form.resetFields()
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
            Tokens minted from payments to this address will belong to the payer
            by default. However, if someone pays the project though a custodial
            service platform such as Coinbase,{' '}
            <strong>
              tokens can't be issued to their personal wallets and will be lost
            </strong>
            .
          </Trans>
        </p>
        <AdvancedOptionsCollapse />
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
