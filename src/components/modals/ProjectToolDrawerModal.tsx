import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'

import { Button, Divider, Drawer, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { useContext, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'

export default function ProjectToolDrawerModal({
  visible,
  onClose,
}: {
  visible?: boolean
  onClose?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId, tokenSymbol, owner, terminal } = useContext(ProjectContext)

  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()
  const [loadingTransferTokens, setLoadingTransferTokens] = useState<boolean>()
  const [loadingTransferOwnership, setLoadingTransferOwnership] =
    useState<boolean>()
  const [transferTokensForm] = useForm<{ amount: string; to: string }>()
  const [addToBalanceForm] = useForm<{ amount: string }>()
  const [transferOwnershipForm] = useForm<{ to: string }>()

  const stakedTokenBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args:
      userAddress && projectId ? [userAddress, projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })

  function transferOwnership() {
    if (!transactor || !contracts || !projectId || !owner) return

    setLoadingTransferOwnership(true)

    const fields = transferTokensForm.getFieldsValue(true)

    transactor(
      contracts.Projects,
      'safeTransferFrom(address,address,uint256)',
      [owner, fields.to, projectId.toHexString()],
      {
        onDone: () => setLoadingTransferOwnership(false),
        onConfirmed: () => transferOwnershipForm.resetFields(),
      },
    )
  }

  function transferTokens() {
    if (!transactor || !contracts || !userAddress || !projectId) return

    setLoadingTransferTokens(true)

    const fields = transferTokensForm.getFieldsValue(true)

    transactor(
      contracts.TicketBooth,
      'transfer',
      [
        userAddress,
        projectId?.toHexString(),
        parseWad(fields.amount).toHexString(),
        fields.to,
      ],
      {
        onDone: () => setLoadingTransferTokens(false),
        onConfirmed: () => transferTokensForm.resetFields(),
      },
    )
  }

  function addToBalance() {
    if (
      !transactor ||
      !contracts ||
      !userAddress ||
      !projectId ||
      !terminal?.version
    )
      return

    setLoadingAddToBalance(true)

    const fields = addToBalanceForm.getFieldsValue(true)

    transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'addToBalance',
      [projectId.toHexString()],
      {
        value: parseWad(fields.amount).toHexString(),
        onDone: () => setLoadingAddToBalance(false),
        onConfirmed: () => addToBalanceForm.resetFields(),
      },
    )
  }

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
            <Trans>Transfer staked {tokenSymbol || 'tokens'}</Trans>
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
                <Trans>Transfer {tokenSymbol || 'tokens'}</Trans>
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
            <Form.Item name="amount" label="Amount">
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
