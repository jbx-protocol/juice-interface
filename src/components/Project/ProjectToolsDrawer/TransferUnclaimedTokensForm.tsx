import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactorButton from 'components/TransactorButton'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { NetworkContext } from 'contexts/networkContext'
import { EthAddressInput } from 'components/inputs/EthAddressInput'

export function TransferUnclaimedTokensForm({
  tokenSymbol,
  unclaimedTokenBalance,
  useTransferUnclaimedTokensTx,
}: {
  tokenSymbol: string | undefined
  unclaimedTokenBalance: BigNumber | undefined
  useTransferUnclaimedTokensTx: () => TransactorInstance<{
    to: string
    amount: BigNumber
  }>
}) {
  const { userAddress } = useContext(NetworkContext)

  const [loadingTransferTokens, setLoadingTransferTokens] = useState<boolean>()

  const [transferTokensForm] = Form.useForm<{ amount: string; to: string }>()
  const transferUnclaimedTokensTx = useTransferUnclaimedTokensTx()

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

  const tokenSymbolShort = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  return (
    <Form form={transferTokensForm} layout="vertical">
      <h3>
        <Trans>Transfer unclaimed {tokenSymbolShort}</Trans>
      </h3>
      <p>
        <Trans>
          Your unclaimed token balance:{' '}
          {formatWad(unclaimedTokenBalance, { precision: 0 })}
        </Trans>
      </p>
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
              content={<Trans>MAX</Trans>}
              onClick={() =>
                transferTokensForm.setFieldsValue({
                  amount: fromWad(unclaimedTokenBalance),
                })
              }
            />
          }
        />
      </Form.Item>
      <Form.Item name="to" label={t`Recipient Address`}>
        <EthAddressInput />
      </Form.Item>
      <Form.Item>
        <TransactorButton
          onClick={() => transferTokens()}
          loading={loadingTransferTokens}
          size="small"
          type="primary"
          text={<Trans>Transfer {tokenSymbolShort}</Trans>}
          disabled={!userAddress}
          connectWalletText={<Trans>Connect wallet to transfer</Trans>}
        />
      </Form.Item>
    </Form>
  )
}
