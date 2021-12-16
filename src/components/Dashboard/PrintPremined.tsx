import { BigNumber } from '@ethersproject/bignumber'
import { Button, Form, Input, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { UserContext } from 'contexts/userContext'
import { constants, utils } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useState } from 'react'
import { parseWad } from 'utils/formatNumber'

export default function PrintPremined({ projectId }: { projectId: BigNumber }) {
  const { contracts, transactor } = useContext(UserContext)
  const [form] = useForm<{
    beneficary: string
    preferUnstaked: boolean
    memo: string
  }>()

  const [currency, setCurrency] = useState<CurrencyOption>(0)
  const [value, setValue] = useState<string>('0')
  const [loading, setLoading] = useState<boolean>()
  const [modalVisible, setModalVisible] = useState<boolean>()

  async function mint() {
    if (!contracts || !projectId || !transactor) return

    setLoading(true)

    await form.validateFields()

    transactor(
      contracts.TerminalV1_1,
      'printTickets',
      [
        projectId.toHexString(),
        parseWad(value).toHexString(),
        BigNumber.from(currency).toHexString(),
        form.getFieldValue('beneficary') ?? '',
        form.getFieldValue('memo') ?? '',
        form.getFieldValue('preferUnstaked'),
      ],
      {
        onConfirmed: () => {
          form.resetFields()
          setValue('0')
          setModalVisible(false)
        },
        onDone: () => setLoading(false),
      },
    )
  }

  return (
    <div>
      <Button block onClick={() => setModalVisible(true)} type="primary">
        Mint tokens
      </Button>
      <div>
        Note: Tokens can be minted manually when allowed in the current funding
        cycle. This can be changed by the project owner for upcoming cycles.
      </div>

      <Modal
        visible={modalVisible}
        onOk={mint}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        okText="Mint tokens"
      >
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
          <FormItems.ProjectTarget
            formItemProps={{
              label: 'Amount',
              extra:
                'The minted token amount will be calculated based on if the receiver had paid this amount to this project.',
            }}
            currency={currency}
            onCurrencyChange={setCurrency}
            value={value}
            onValueChange={val => setValue(val ?? '0')}
          />
          <Form.Item label="Memo" name="memo">
            <Input placeholder="Memo included on-chain (optional)" />
          </Form.Item>
          <Form.Item
            name="preferUnstaked"
            label="Mint as ERC-20"
            extra="You can mint ERC-20 tokens if they have been issued for this project. Otherwise staked tokens will be minted, which can be claimed later as ERC-20 by the recever."
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
