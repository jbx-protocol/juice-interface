import { t } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { utils } from 'ethers'
import useNameOfERC20 from 'hooks/ERC20/useNameOfERC20'
import { useJBContractContext, useReadJbTokensTokenOf, useWriteJbControllerMintTokensOf } from 'juice-sdk-react'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useContext, useState } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { Address } from 'viem'

type MintForm = {
  beneficary: string
  memo: string
  amount: string
}

export function V4MintModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { writeContractAsync: writeMintTokens } =
    useWriteJbControllerMintTokensOf()
  const [form] = useForm<MintForm>()

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const { projectId, contracts } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: tokenSymbol } = useNameOfERC20(tokenAddress)

  async function executeMintTx() {
    const formValues = form.getFieldsValue(true) as MintForm
    const amount = parseWad(formValues.amount ?? '0').toBigInt()
    const memo = formValues.memo
    const beneficiary = formValues.beneficary as Address

    if (
      !contracts.controller.data ||
      !beneficiary ||
      !amount ||
      !projectId
    )
      return

    setLoading(true)

    const args = [
      projectId,
      amount,
      beneficiary,
      memo,
      false, //useReservedPercent
    ] as const

    try {
      const hash = await writeMintTokens({
        address: contracts.controller.data,
        args,
      })
      setTransactionPending(true)

      addTransaction?.('Mint tokens', { hash })
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })

      setLoading(false)
      setTransactionPending(false)
      onConfirmed?.()
    } catch (e) {
      setLoading(false)

      emitErrorNotification((e as unknown as Error).message)
    }
  }

  const tokensTokenLower = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const tokensTokenUpper = tokenSymbolText({
    tokenSymbol,
    capitalize: true,
    plural: false,
  })

  return (
    <TransactionModal
      open={open}
      title={t`Mint ${tokensTokenLower}`}
      onOk={executeMintTx}
      confirmLoading={loading}
      transactionPending={transactionPending}
      onCancel={onCancel}
      okText={t`Mint ${tokensTokenLower}`}
    >
      <p>Mint new tokens to a specified address.</p>

      <Form layout="vertical" form={form}>
        <Form.Item
          label={t`Token receiver`}
          name="beneficary"
          rules={[
            {
              required: true,
              validateTrigger: 'onCreate',
              validator: (rule, value) => {
                if (!value || !utils.isAddress(value))
                  return Promise.reject('Not a valid ETH address')
                else return Promise.resolve()
              },
            },
          ]}
        >
          <EthAddressInput />
        </Form.Item>
        <Form.Item
          name="amount"
          label={t`${tokensTokenUpper} amount`}
          extra={t`The amount of tokens to mint to the receiver.`}
          rules={[
            {
              required: true,
              validateTrigger: 'onCreate',
              validator: (rule, value) => {
                if (!value || value === '0') {
                  return Promise.reject('Invalid value')
                }
                return Promise.resolve()
              },
            },
          ]}
          required
        >
          <FormattedNumberInput placeholder="0" />
        </Form.Item>
        <Form.Item label="Memo" name="memo">
          <Input placeholder="Memo included on-chain (optional)" />
        </Form.Item>
      </Form>
    </TransactionModal>
  )
}
