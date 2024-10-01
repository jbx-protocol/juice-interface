import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import TransactorButton from 'components/buttons/TransactorButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { BigNumber } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
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
      <h3 className="text-primary">
        <Trans>Transfer ETH to this project</Trans>
      </h3>
      <p>
        <Trans>
          Transfer ETH from your wallet to this project without minting tokens.
        </Trans>
      </p>

      <Form.Item name="amount" label={<Trans>Transfer amount</Trans>}>
        <FormattedNumberInput
          placeholder="0"
          accessory={<InputAccessoryButton content="ETH" />}
        />
      </Form.Item>
      <TransactorButton
        onClick={() => addToBalance()}
        loading={loadingAddToBalance}
        size="small"
        type="primary"
        text={<Trans>Transfer ETH to project</Trans>}
        disabled={!userAddress}
        connectWalletText={<Trans>Connect wallet to transfer ETH</Trans>}
      />
    </Form>
  )
}
