import { BigNumber } from '@ethersproject/bignumber'
import { Form, Input, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { CURRENCY_ETH } from 'constants/currency'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { constants, Contract, utils } from 'ethers'
import { useContext, useState } from 'react'
import { parseWad } from 'utils/formatNumber'

export default function PrintPreminedModal({
  visible,
  onCancel,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction
}) {
  const { contracts, transactor } = useContext(UserContext)
  const { tokenSymbol, tokenAddress, projectId, terminal } =
    useContext(ProjectContext)
  const [form] = useForm<{
    beneficary: string
    preferUnstaked: boolean
    memo: string
  }>()

  const [value, setValue] = useState<string>('0')
  const [loading, setLoading] = useState<boolean>()

  async function mint() {
    if (!contracts || !projectId || !transactor || !terminal?.version) return

    setLoading(true)

    await form.validateFields()

    let terminalContract: Contract
    let functionName: string
    let args: any[]

    switch (terminal.version) {
      case '1':
        terminalContract = contracts.TerminalV1
        functionName = 'printPreminedTickets'
        args = [
          projectId.toHexString(),
          parseWad(value).toHexString(),
          BigNumber.from(CURRENCY_ETH).toHexString(),
          form.getFieldValue('beneficary') ?? '',
          form.getFieldValue('memo') ?? '',
          form.getFieldValue('preferUnstaked'),
        ]
        break
      case '1.1':
        terminalContract = contracts.TerminalV1_1
        functionName = 'printTickets'
        args = [
          projectId.toHexString(),
          parseWad(value).toHexString(),
          form.getFieldValue('beneficary') ?? '',
          form.getFieldValue('memo') ?? '',
          form.getFieldValue('preferUnstaked'),
        ]
    }

    transactor(terminalContract, functionName, args, {
      onConfirmed: () => {
        form.resetFields()
        setValue('0')
        if (onCancel) onCancel()
      },
      onDone: () => {
        setLoading(false)
      },
    })
  }

  const erc20Issued =
    tokenSymbol && tokenAddress && tokenAddress !== constants.AddressZero

  return (
    <Modal
      visible={visible}
      onOk={mint}
      confirmLoading={loading}
      onCancel={onCancel}
      okText="Mint tokens"
    >
      <div style={{ marginBottom: 20 }}>
        Note: Tokens can be minted manually when allowed in the current funding
        cycle. This can be changed by the project owner for upcoming cycles.
      </div>

      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tokens receiver"
          name="beneficary"
          rules={[
            {
              required: true,
              validator: (rule: any, value: any) => {
                if (!utils.isAddress(value))
                  return Promise.reject('Not a valid ETH address')
                else return Promise.resolve()
              },
            },
          ]}
        >
          <Input placeholder={constants.AddressZero} />
        </Form.Item>
        <FormattedNumberInput
          formItemProps={{
            label: 'Payment equivalent',
            extra:
              'The amount of tokens minted to the receiver will be calculated based on if they had paid this amount to the project in the current funding cycle.',
          }}
          value={value}
          onChange={val => setValue(val ?? '0')}
          accessory={<InputAccessoryButton content="ETH" />}
        />
        <Form.Item label="Memo" name="memo">
          <Input placeholder="Memo included on-chain (optional)" />
        </Form.Item>
        <Form.Item
          name="preferUnstaked"
          label="Mint as ERC-20"
          valuePropName="checked"
          extra={
            erc20Issued
              ? `Enabling this will mint ${tokenSymbol} ERC-20 tokens. Otherwise staked ${tokenSymbol} tokens will be minted, which can be claimed later as ERC-20 by the recever.`
              : 'ERC-20 tokens can only be minted once an ERC-20 token has been issued for this project.'
          }
          initialValue={false}
        >
          <Switch disabled={!erc20Issued} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
