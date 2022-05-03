import { t, Trans } from '@lingui/macro'
import { Button, Divider, Drawer, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { BigNumber } from '@ethersproject/bignumber'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { useContext, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { TransactorInstance } from 'hooks/Transactor'
import { JBDiscordLink } from 'components/Landing/QAs'

import ArchiveV1Project from 'components/v1/V1Project/ArchiveV1Project'
import { NetworkContext } from 'contexts/networkContext'
import LaunchProjectPayerButton from 'components/v2/V2Project/LaunchProjectPayerButton'
import { ThemeContext } from 'contexts/themeContext'

export default function ProjectToolDrawerModal({
  visible,
  onClose,
  unclaimedTokenBalance,
  tokenSymbol,
  ownerAddress,
  useTransferProjectOwnershipTx,
  useTransferUnclaimedTokensTx,
  useAddToBalanceTx,
  useSetProjectUriTx,
  useDeployProjectPayerTx,
}: {
  visible?: boolean
  onClose?: VoidFunction
  unclaimedTokenBalance: BigNumber | undefined
  tokenSymbol: string | undefined
  ownerAddress: string | undefined
  useTransferProjectOwnershipTx: () => TransactorInstance<{
    newOwnerAddress: string
  }>
  useTransferUnclaimedTokensTx: () => TransactorInstance<{
    to: string
    amount: BigNumber
  }>
  useAddToBalanceTx: () => TransactorInstance<{
    value: BigNumber
  }>
  useSetProjectUriTx: () =>
    | TransactorInstance<{
        cid: string
      }>
    | undefined // Currently undefined for v2
  useDeployProjectPayerTx: () => TransactorInstance<{}> | undefined // undefined for v1
}) {
  const { userAddress } = useContext(NetworkContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const transferProjectOwnershipTx = useTransferProjectOwnershipTx()
  const transferUnclaimedTokensTx = useTransferUnclaimedTokensTx()
  const addToBalanceTx = useAddToBalanceTx()

  const setUriTx = useSetProjectUriTx()

  const deployProjectPayerTx = useDeployProjectPayerTx()

  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()
  const [loadingTransferTokens, setLoadingTransferTokens] = useState<boolean>()
  const [loadingTransferOwnership, setLoadingTransferOwnership] =
    useState<boolean>()

  const [transferTokensForm] = useForm<{ amount: string; to: string }>()
  const [addToBalanceForm] = useForm<{ amount: string }>()
  const [transferOwnershipForm] = useForm<{ to: string }>()

  function transferOwnership() {
    setLoadingTransferOwnership(true)

    transferProjectOwnershipTx(
      { newOwnerAddress: transferTokensForm.getFieldValue('to') },
      {
        onConfirmed: () => {
          setLoadingTransferOwnership(false)
          transferOwnershipForm.resetFields()
        },
      },
    )
  }

  function transferTokens() {
    setLoadingTransferTokens(true)

    const fields = transferTokensForm.getFieldsValue(true)

    transferUnclaimedTokensTx(
      {
        to: fields.to,
        amount: parseWad(fields.amount),
      },
      {
        onConfirmed: () => {
          transferTokensForm.resetFields()
          setLoadingTransferTokens(false)
        },
      },
    )
  }

  function addToBalance() {
    setLoadingAddToBalance(true)

    addToBalanceTx(
      { value: parseWad(addToBalanceForm.getFieldValue('amount')) },
      {
        onConfirmed: () => {
          setLoadingAddToBalance(false)
          addToBalanceForm.resetFields()
        },
      },
    )
  }

  const isOwnerWallet =
    ownerAddress &&
    userAddress &&
    ownerAddress.toLowerCase() === userAddress.toLowerCase()

  const tokenSymbolShort = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  return (
    <Drawer visible={visible} onClose={onClose} width={600}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <h1>
          <Trans>Tools</Trans>
        </h1>

        {isOwnerWallet && (
          <>
            <section>
              <h3>
                <Trans>Transfer ownership</Trans>
              </h3>
              <p>
                <Trans>Current owner: {ownerAddress}</Trans>
              </p>
              <Form
                form={transferOwnershipForm}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Form.Item name="to" label="To">
                  <FormItems.EthAddress
                    defaultValue={undefined}
                    onAddressChange={to =>
                      transferTokensForm.setFieldsValue({ to })
                    }
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    onClick={() => transferOwnership()}
                    loading={loadingTransferOwnership}
                    size="small"
                    type="primary"
                  >
                    <span>
                      <Trans>Transfer ownership</Trans>
                    </span>
                  </Button>
                </Form.Item>
              </Form>
            </section>

            <Divider />
          </>
        )}
        {deployProjectPayerTx && (
          <>
            <section>
              <h3>
                <Trans>Create payable address</Trans>
              </h3>
              <p>
                <Trans>
                  Create an Ethereum address that can be used to pay your
                  project directly.
                </Trans>
              </p>
              <LaunchProjectPayerButton
                useDeployProjectPayerTx={useDeployProjectPayerTx}
              />
              <p style={{ marginTop: 10, color: colors.text.secondary }}>
                <ExclamationCircleOutlined />{' '}
                <Trans>
                  If you have already deployed a payable address and have lost
                  it, please contact the Juicebox team through{' '}
                  <JBDiscordLink>Discord.</JBDiscordLink>
                </Trans>
              </p>
            </section>
            <Divider />
          </>
        )}

        <section>
          <h3>
            <Trans>Transfer unclaimed {tokenSymbolShort}</Trans>
          </h3>
          <p>
            <Trans>
              Your balance: {formatWad(unclaimedTokenBalance, { precision: 0 })}
            </Trans>
          </p>
          <Form form={transferTokensForm} layout="vertical">
            <Form.Item name="amount" label="Amount">
              <FormattedNumberInput
                placeholder="0"
                onChange={amount =>
                  transferTokensForm.setFieldsValue({
                    amount,
                  })
                }
                accessory={
                  <InputAccessoryButton
                    content={t`MAX`}
                    onClick={() =>
                      transferTokensForm.setFieldsValue({
                        amount: fromWad(unclaimedTokenBalance),
                      })
                    }
                  />
                }
              />
            </Form.Item>
            <Form.Item name="to" label="To">
              <FormItems.EthAddress
                defaultValue={undefined}
                onAddressChange={to =>
                  transferTokensForm.setFieldsValue({ to })
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => transferTokens()}
                loading={loadingTransferTokens}
                size="small"
                type="primary"
              >
                <span>
                  <Trans>Transfer {tokenSymbolShort}</Trans>
                </span>
              </Button>
            </Form.Item>
          </Form>
        </section>

        <Divider />

        <section>
          <h3>
            <Trans>Add to Balance</Trans>
          </h3>
          <p>
            <Trans>
              Add funds to this project's balance without minting tokens.
            </Trans>
          </p>
          <Form form={addToBalanceForm} layout="vertical">
            <Form.Item name="amount" label={t`Pay amount`}>
              <FormattedNumberInput
                placeholder="0"
                onChange={amount =>
                  addToBalanceForm.setFieldsValue({
                    amount,
                  })
                }
                accessory={<InputAccessoryButton content="ETH" />}
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => addToBalance()}
                loading={loadingAddToBalance}
                size="small"
                type="primary"
              >
                <span>
                  <Trans>Add to balance</Trans>
                </span>
              </Button>
            </Form.Item>
          </Form>
        </section>

        {isOwnerWallet ? (
          setUriTx ? (
            <>
              <Divider />
              <ArchiveV1Project setUriTx={setUriTx} />
            </>
          ) : (
            <>
              <Divider />
              <section>
                <h3>
                  <Trans>Archive project</Trans>
                </h3>
                <p>
                  <Trans>
                    Please contact the Juicebox dev team through our{' '}
                    <JBDiscordLink>Discord</JBDiscordLink> to have your project
                    archived.
                  </Trans>
                </p>
              </section>
            </>
          )
        ) : null}
        <br />
      </Space>
    </Drawer>
  )
}
