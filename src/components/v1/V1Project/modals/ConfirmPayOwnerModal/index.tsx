import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/shared/FormattedAddress'
import ImageUploader from 'components/shared/inputs/ImageUploader'
import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { constants } from 'ethers'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { usePayProjectTx } from 'hooks/v1/transactor/PayProjectTx'
import { useContext, useState } from 'react'
import { currencyName } from 'utils/v1/currency'
import { formattedNum, formatWad } from 'utils/formatNumber'
import { weightedRate } from 'utils/math'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import ProjectRiskNotice from './ProjectRiskNotice'

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
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, tokenAddress, currentFC, metadata } =
    useContext(V1ProjectContext)
  const payProjectTx = usePayProjectTx()

  const converter = useCurrencyConverter()

  const usdAmount = converter.weiToUsd(weiAmount)

  async function pay() {
    if (!weiAmount) return

    await form.validateFields()

    if (userAddress) {
      setLoading(true)
    }

    payProjectTx(
      {
        note: form.getFieldValue('note'),
        preferUnstaked,
        value: weiAmount,
      },
      {
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
      title={t`Pay ${metadata.name}`}
      visible={visible}
      onOk={pay}
      okText={t`Pay`}
      onCancel={onCancel}
      confirmLoading={loading}
      width={640}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <p>
          <Trans>
            Paying {metadata.name} is not an investment—it's a way to support
            the project. Any value or utility of the tokens you receive is
            determined by {metadata.name}.
          </Trans>
        </p>

        {metadata.payDisclosure && (
          <div>
            <h4>
              <Trans>Notice from {metadata.name}:</Trans>
            </h4>
            <p>{metadata.payDisclosure}</p>
          </div>
        )}

        <ProjectRiskNotice />

        <Descriptions column={1} bordered>
          <Descriptions.Item label={t`Pay amount`} className="content-right">
            {formattedNum(usdAmount)} {currencyName(1)} ({formatWad(weiAmount)}{' '}
            {currencyName(0)})
          </Descriptions.Item>
          <Descriptions.Item
            label={t`${tokenSymbolText({
              tokenSymbol: tokenSymbol,
              capitalize: true,
              plural: true,
            })} for you`}
            className="content-right"
          >
            <div>{formatWad(receivedTickets, { precision: 0 })}</div>
            <div>
              {userAddress ? (
                <Trans>
                  To: <FormattedAddress address={userAddress} />
                </Trans>
              ) : null}
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={t`${tokenSymbolText({
              tokenSymbol: tokenSymbol,
              capitalize: true,
              plural: true,
            })} reserved`}
            className="content-right"
          >
            {formatWad(ownerTickets, { precision: 0 })}
          </Descriptions.Item>
        </Descriptions>
        <Form form={form} layout="vertical">
          <Form.Item label={t`Memo`} name="note" rules={[{ max: 256 }]}>
            <Input.TextArea
              placeholder={t`(Optional) Add a note to this payment on-chain`}
              maxLength={256}
              showCount
              autoSize
            />
          </Form.Item>
          <Form.Item>
            <ImageUploader
              text={t`Add image`}
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
            <Form.Item label={t`Receive ERC20`}>
              <Space align="start">
                <Checkbox
                  style={{ padding: 20 }}
                  checked={preferUnstaked}
                  onChange={e => setPreferUnstaked(e.target.checked)}
                />
                <label htmlFor="preferUnstaked">
                  <Trans>
                    Check this to mint {tokenSymbol} ERC20 to your wallet. Leave
                    unchecked to have your token balance tracked by Juicebox,
                    saving gas on this transaction. You can always claim your
                    ERC20 tokens later.
                  </Trans>
                </label>
              </Space>
            </Form.Item>
          )}
        </Form>
      </Space>
    </Modal>
  )
}
