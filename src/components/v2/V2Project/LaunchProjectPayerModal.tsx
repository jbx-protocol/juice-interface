import { t, Trans } from '@lingui/macro'
import { useContext, useState } from 'react'

import { TransactionReceipt } from '@ethersproject/providers'
import { TransactorInstance } from 'hooks/Transactor'

import { Checkbox, Collapse, Input, Modal, notification, Switch } from 'antd'
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

import { readProvider } from 'constants/readProvider'
import TransactionModal from '../../shared/TransactionModal'
import FormItemLabel from '../V2Create/FormItemLabel'

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

  const [tokenMintingEnabled, setTokenMintingEnabled] = useState<boolean>(true)
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)
  const [customBeneficiaryAddress, setCustomBeneficiaryAddress] =
    useState<string>()
  const [customMemo, setCustomMemo] = useState<string>('')
  const [preferClaimed, setPreferClaimed] = useState<boolean>(true)

  const [confirmedModalVisible, setConfirmedModalVisible] = useState<boolean>()
  // TODO: load project payer and show different thing in this section if the project already has one
  // (Issue: #897)

  const deployProjectPayerTx = useDeployProjectPayerTx()

  function AdvancedOptionsCollapse() {
    return (
      <Collapse defaultActiveKey={undefined} accordion>
        <CollapsePanel header={t`Advanced options`} key={0}>
          <div>
            <TooltipLabel
              label={t`Custom memo`}
              tip={
                <Trans>
                  The memo that will appear in the project's payment feed when
                  someone pays this address.
                </Trans>
              }
            />
            <Input
              placeholder={t`Payment through Frank's payable address`}
              type="string"
              autoComplete="off"
              onChange={e => setCustomMemo(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <FormItemLabel>
              <TooltipLabel
                label={t`Token minting enabled`}
                tip={t`Determines whether tokens will be minted when people pay to this address.`}
              />
            </FormItemLabel>
            <Switch
              onChange={setTokenMintingEnabled}
              checked={tokenMintingEnabled}
            />
          </div>
          {tokenMintingEnabled ? (
            <div style={{ display: 'flex' }}>
              <FormItemLabel>
                <TooltipLabel
                  label={t`Custom token beneficiary`}
                  tip={
                    <Trans>
                      By default, newly minted tokens will go to the wallet who
                      sends funds to the address. You can enable this to set the
                      token beneficiary to a custom address.
                    </Trans>
                  }
                />
              </FormItemLabel>
              <Switch
                onChange={checked => {
                  setCustomBeneficiaryEnabled(checked)
                  setCustomBeneficiaryAddress(checked ? userAddress : undefined)
                }}
                checked={customBeneficiaryEnabled}
              />
            </div>
          ) : null}
          {customBeneficiaryEnabled ? (
            <FormItems.EthAddress
              name="beneficiary"
              defaultValue={userAddress}
              formItemProps={{
                label: t`Beneficiary address`,
                extra: t`This address will receive all the tokens minted from paying this address.`,
              }}
              onAddressChange={setCustomBeneficiaryAddress}
            />
          ) : null}
          {tokenAddress && tokenAddress !== constants.AddressZero ? (
            <div style={{ display: 'flex' }}>
              <FormItemLabel>
                <TooltipLabel
                  label={t`Mint tokens as ERC-20`}
                  tip={
                    <Trans>
                      Check this to mint this project's ERC-20 tokens to the
                      beneficiary's wallet when the payable address receives
                      funds. Leave unchecked to have the beneficiary's newly
                      minted token balance tracked by Juicebox, saving gas on
                      their payment transactions. The beneficiary can always
                      claim their ERC-20 tokens later.
                    </Trans>
                  }
                />
              </FormItemLabel>
              <Checkbox
                style={{ padding: 20 }}
                checked={preferClaimed}
                onChange={e => setPreferClaimed(e.target.checked)}
              />
            </div>
          ) : null}
        </CollapsePanel>
      </Collapse>
    )
  }

  async function deployProjectPayer() {
    if (!deployProjectPayerTx) return

    setLoadingProjectPayer(true)

    const txSuccess = await deployProjectPayerTx(
      {
        customBeneficiaryAddress,
        customMemo,
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
