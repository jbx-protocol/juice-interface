import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactorButton from 'components/TransactorButton'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { useState } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'

export function AddToProjectBalanceForm({
  useAddToBalanceTx,
}: {
  useAddToBalanceTx: () => TransactorInstance<{
    value: BigNumber
  }>
}) {
  const { userAddress } = useWallet()

  const [addToBalanceForm] = Form.useForm<{ amount: string }>()
  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()

  const addToBalanceTx = useAddToBalanceTx()

  async function addToBalance() {
    setLoadingAddToBalance(true)

    const result = await addToBalanceTx(
      { value: parseWad(addToBalanceForm.getFieldValue('amount')) },
      {
        onConfirmed: () => {
          setLoadingAddToBalance(false)
          addToBalanceForm.resetFields()
        },
        onDone: () => {
          setLoadingAddToBalance(false)
        },
        onError: e => {
          setLoadingAddToBalance(false)
          addToBalanceForm.resetFields()
          emitErrorNotification(e.message)
        },
      },
    )

    if (!result) {
      setLoadingAddToBalance(false)
    }
  }

  return (
    <Form form={addToBalanceForm} layout="vertical">
      <h3>
        <Trans>Add to balance</Trans>
      </h3>
      <p>
        <Trans>
          Add funds to this project's balance without minting tokens.
        </Trans>
      </p>

      <Form.Item name="amount" label={<Trans>Pay amount</Trans>}>
        <FormattedNumberInput
          placeholder="0"
          accessory={<InputAccessoryButton content="ETH" />}
        />
      </Form.Item>
      <Form.Item>
        <TransactorButton
          onClick={() => addToBalance()}
          loading={loadingAddToBalance}
          size="small"
          type="primary"
          text={<Trans>Add to balance</Trans>}
          disabled={!userAddress}
          connectWalletText={<Trans>Connect wallet to pay</Trans>}
        />
      </Form.Item>
    </Form>
  )
}
