import { BigNumber } from '@ethersproject/bignumber'
import { Checkbox, Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/shared/FormattedAddress'
import ImageUploader from 'components/shared/inputs/ImageUploader'
import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useContext, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formattedNum, formatWad } from 'utils/formatNumber'
import { weightedRate } from 'utils/math'

export default function ConfirmPayOwnerModal({
  visible,
  weiAmount,
  onSuccess,
  onCancel,
}: {
  visible?: boolean
  weiAmount: BigNumber | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const [preferUnstaked, setPreferUnstaked] = useState<boolean>(false)
  const [form] = useForm<{ note: string }>()
  const { contracts, transactor } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, tokenAddress, currentFC, projectId, metadata } =
    useContext(ProjectContext)

  const converter = useCurrencyConverter()

  const usdAmount = converter.weiToUsd(weiAmount)

  async function pay() {
    if (!contracts || !projectId || !transactor) return

    await form.validateFields()

    setLoading(true)

    transactor(
      contracts.TerminalV1_1,
      'pay',
      [
        projectId.toHexString(),
        userAddress,
        form.getFieldValue('note') || '',
        preferUnstaked,
      ],
      {
        value: weiAmount?.toHexString(),
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
        onDone: () => setLoading(false),
      },
    )
  }

  const receivedTickets = weightedRate(currentFC, weiAmount, 'payer')
  const ownerTickets = weightedRate(currentFC, weiAmount, 'reserved')

  const hasIssuedTokens = tokenAddress && tokenAddress !== constants.AddressZero

  if (!metadata) return null

  return (
    <Modal
      title={'Pay ' + metadata.name}
      visible={visible}
      onOk={pay}
      okText="Pay"
      onCancel={onCancel}
      confirmLoading={loading}
      width={640}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <p>
          Paying {metadata.name} is not an investment—it's a way to support the
          project. Any value or utility of the tokens you receive is determined
          by {metadata.name}.
        </p>

        {metadata.payDisclosure && (
          <div>
            <h4>Notice from {metadata.name}:</h4>
            <p>{metadata.payDisclosure}</p>
          </div>
        )}

        <Descriptions column={1} bordered>
          <Descriptions.Item label="Pay amount" className="content-right">
            {formattedNum(usdAmount)} {currencyName(1)} ({formatWad(weiAmount)}{' '}
            {currencyName(0)})
          </Descriptions.Item>
          <Descriptions.Item
            label={(tokenSymbol ?? 'Tokens') + ' for you'}
            className="content-right"
          >
            <div>{formatWad(receivedTickets, { decimals: 0 })}</div>
            <div>
              To: <FormattedAddress address={userAddress} />
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={(tokenSymbol ?? 'Tokens') + ' reserved'}
            className="content-right"
          >
            {formatWad(ownerTickets, { decimals: 0 })}
          </Descriptions.Item>
        </Descriptions>
        <Form form={form} layout="vertical">
          <Form.Item label="Memo" name="note" rules={[{ max: 256 }]}>
            <Input.TextArea
              placeholder="(Optional) Add a note to this payment on-chain"
              maxLength={256}
              showCount
              autoSize
            />
          </Form.Item>
          <Form.Item>
            <ImageUploader
              text="Add image"
              onSuccess={url => {
                if (!url) return
                const note = form.getFieldValue('note') || ''
                form.setFieldsValue({
                  note: note ? note + ' ' + url : url,
                })
              }}
            />
          </Form.Item>
          {hasIssuedTokens && (
            <Form.Item label="Receive ERC20">
              <Space align="start">
                <Checkbox
                  style={{ padding: 20 }}
                  checked={preferUnstaked}
                  onChange={e => setPreferUnstaked(e.target.checked)}
                />
                <label htmlFor="preferUnstaked">
                  Check this to mint {tokenSymbol} ERC20 to your wallet. Leave
                  unchecked to have your token balance tracked by Juicebox,
                  saving gas on this transaction. You can always claim your
                  ERC20 tokens later.
                </label>
              </Space>
            </Form.Item>
          )}
        </Form>
      </Space>
    </Modal>
  )
}
