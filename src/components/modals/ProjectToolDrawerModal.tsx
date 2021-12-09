import { BigNumber } from '@ethersproject/bignumber'
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
  const { projectId, tokenSymbol, owner } = useContext(ProjectContext)

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
    if (!transactor || !contracts || !userAddress || !projectId) return

    setLoadingAddToBalance(true)

    const fields = addToBalanceForm.getFieldsValue(true)

    transactor(
      contracts.TerminalV1_1,
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
        <h1>Tools</h1>

        <section>
          <h3>Transfer ownership</h3>
          <p>Current owner: {owner}</p>
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
                Transfer ownership
              </Button>
            </Form.Item>
          </Form>
        </section>

        <Divider />

        <section>
          <h3>Transfer staked {tokenSymbol || 'tokens'}</h3>
          <p>Your balance: {formatWad(stakedTokenBalance, { decimals: 0 })}</p>
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
                    content="MAX"
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
                Transfer {tokenSymbol || 'tokens'}
              </Button>
            </Form.Item>
          </Form>
        </section>

        <Divider />

        <section>
          <h3>Add to Balance</h3>
          <p>Add funds to this project's balance without minting tokens.</p>
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
                Add to balance
              </Button>
            </Form.Item>
          </Form>
        </section>
      </Space>
    </Drawer>
  )
}
