import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactorButton from 'components/TransactorButton'
import { NetworkContext } from 'contexts/networkContext'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext, useState } from 'react'
import { parseWad } from 'utils/formatNumber'

export function AddToProjectBalanceForm({
  useAddToBalanceTx,
}: {
  useAddToBalanceTx: () => TransactorInstance<{
    value: BigNumber
  }>
}) {
  const { userAddress } = useContext(NetworkContext)

  const [addToBalanceForm] = Form.useForm<{ amount: string }>()
  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()

  const addToBalanceTx = useAddToBalanceTx()

  function addToBalance() {
    setLoadingAddToBalance(true)

    addToBalanceTx(
      { value: parseWad(addToBalanceForm.getFieldValue('amount')) },
      {
        onConfirmed: () => {
          setLoadingAddToBalance(false)
          addToBalanceForm.resetFields()
        },
      },
    )
  }

  return (
    <Form form={addToBalanceForm} layout="vertical">
      <h3>
        <Trans>Add to Balance</Trans>
      </h3>
      <p>
        <Trans>
          Add funds to this project's balance without minting tokens.
        </Trans>
      </p>

      <Form.Item name="amount" label={<Trans>Pay amount</Trans>}>
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
