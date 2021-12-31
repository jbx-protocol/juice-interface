import { BigNumber } from '@ethersproject/bignumber'
import { Button, Form, Input, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { UserContext } from 'contexts/userContext'
import { constants, utils } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useState } from 'react'
import { parseWad } from 'utils/formatNumber'

import {
  targetToTargetSubFeeFormatted,
  targetSubFeeToTargetFormatted,
} from 'components/shared/formItems/formHelpers'

export default function PrintPremined({ projectId }: { projectId: BigNumber }) {
  const { contracts, transactor } = useContext(UserContext)
  const [form] = useForm<{
    beneficary: string
    preferUnstaked: boolean
    memo: string
  }>()

  const [currency, setCurrency] = useState<CurrencyOption>(0)
  const [target, setTarget] = useState<string>('0')
  const [targetSubFee, setTargetSubFee] = useState<string>('0')
  const [loading, setLoading] = useState<boolean>()
  const [modalVisible, setModalVisible] = useState<boolean>()
  const { adminFeePercent } = useContext(UserContext)

  async function mint() {
    if (!contracts || !projectId || !transactor) return

    setLoading(true)

    await form.validateFields()

    transactor(
      contracts.TerminalV1,
      'printPreminedTickets',
      [
        projectId.toHexString(),
        parseWad(target).toHexString(),
        BigNumber.from(currency).toHexString(),
        form.getFieldValue('beneficary') ?? '',
        form.getFieldValue('memo') ?? '',
        form.getFieldValue('preferUnstaked'),
      ],
      {
        onConfirmed: () => {
          form.resetFields()
          setTarget('0')
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
        Note: You may only manually mint tokens before your project has received
        its first payment!
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
            target={target}
            targetSubFee={targetSubFee}
            onTargetChange={target => {
              setTarget(target || '0')
              setTargetSubFee(
                targetToTargetSubFeeFormatted(target || '0', adminFeePercent),
              )
            }}
            onTargetSubFeeChange={targetSubFee => {
              setTargetSubFee(targetSubFee || '0')
              setTarget(
                targetSubFeeToTargetFormatted(
                  targetSubFee || '0',
                  adminFeePercent,
                ),
              )
            }}
          />
          <Form.Item label="Memo" name="memo">
            <Input placeholder="Memo included on-chain (optional)" />
          </Form.Item>
          <Form.Item
            name="preferUnstaked"
            label="Mint as ERC-20"
            extra="You can mint ERC-20 tokens if they have been issued for this project. Otherwise token balances will be tracked by the contract, and can be claimed later as ERC-20 by the recever."
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
