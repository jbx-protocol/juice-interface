import { t, Trans } from '@lingui/macro'
import { Button, Divider, Drawer, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { useAddToBalanceTx } from 'hooks/v1/transactor/AddToBalanceTx'
import { useSafeTransferFromTx } from 'hooks/v1/transactor/SafeTransferFromTx'
import { useTransferTokensTx } from 'hooks/v1/transactor/TransferTokensTx'
import { useContext, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'

export default function ProjectToolDrawerModal({
  visible,
  onClose,
}: {
  visible?: boolean
  onClose?: VoidFunction
}) {
  const { tokenSymbol, owner } = useContext(V1ProjectContext)
  const safeTransferFromTx = useSafeTransferFromTx()
  const transferTokensTx = useTransferTokensTx()
  const addToBalanceTx = useAddToBalanceTx()

  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()
  const [loadingTransferTokens, setLoadingTransferTokens] = useState<boolean>()
  const [loadingTransferOwnership, setLoadingTransferOwnership] =
    useState<boolean>()
  const [transferTokensForm] = useForm<{ amount: string; to: string }>()
  const [addToBalanceForm] = useForm<{ amount: string }>()
  const [transferOwnershipForm] = useForm<{ to: string }>()

  const stakedTokenBalance = useUnclaimedBalanceOfUser()

  function transferOwnership() {
    setLoadingTransferOwnership(true)

    safeTransferFromTx(
      { to: transferTokensForm.getFieldValue('to') },
      {
        onDone: () => setLoadingTransferOwnership(false),
        onConfirmed: () => transferOwnershipForm.resetFields(),
      },
    )
  }

  function transferTokens() {
    setLoadingTransferTokens(true)

    const fields = transferTokensForm.getFieldsValue(true)

    transferTokensTx(
      {
        to: fields.to,
        amount: parseWad(fields.amount),
      },
      {
        onDone: () => setLoadingTransferTokens(false),
        onConfirmed: () => transferTokensForm.resetFields(),
      },
    )
  }

  function addToBalance() {
    setLoadingAddToBalance(true)

    addToBalanceTx(
      { value: parseWad(addToBalanceForm.getFieldValue('amount')) },
      {
        onDone: () => setLoadingAddToBalance(false),
        onConfirmed: () => addToBalanceForm.resetFields(),
      },
    )
  }

  const tokenSymbolText = tokenSymbol || t`tokens`

  return (
    <Drawer visible={visible} onClose={onClose} width={600}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <h1>
          <Trans>Tools</Trans>
        </h1>

        <section>
          <h3>
            <Trans>Transfer ownership</Trans>
          </h3>
          <p>
            <Trans>Current owner: {owner}</Trans>
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
                <Trans>Transfer ownership</Trans>
              </Button>
            </Form.Item>
          </Form>
        </section>

        <Divider />

        <section>
          <h3>
            <Trans>Transfer unclaimed {tokenSymbolText}</Trans>
          </h3>
          <p>
            <Trans>
              Your balance: {formatWad(stakedTokenBalance, { precision: 0 })}
            </Trans>
          </p>
          <Form
            form={transferTokensForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
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
                        amount: fromWad(stakedTokenBalance),
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
                <Trans>Transfer {tokenSymbolText}</Trans>
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
          <Form
            form={addToBalanceForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item name="amount" label={t`Amount`}>
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
                <Trans>Add to balance</Trans>
              </Button>
            </Form.Item>
          </Form>
        </section>
      </Space>
    </Drawer>
  )
}
