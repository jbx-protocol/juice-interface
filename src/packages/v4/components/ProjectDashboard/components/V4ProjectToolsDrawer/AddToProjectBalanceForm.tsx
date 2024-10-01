import { Trans } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import { Form } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import TransactorButton from 'components/buttons/TransactorButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { NATIVE_TOKEN } from 'juice-sdk-core'
import { useJBContractContext, useWriteJbMultiTerminalAddToBalanceOf } from 'juice-sdk-react'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useContext, useState } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { reloadWindow } from 'utils/windowUtils'

export function AddToProjectBalanceForm() {
  const { contracts, projectId } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()

  const { userAddress } = useWallet()

  const [addToBalanceForm] = Form.useForm<{ amount: string }>()

  const { writeContractAsync: writeAddToBalance } =
  useWriteJbMultiTerminalAddToBalanceOf()
  

  async function addToBalance() {
    const amount = parseWad(addToBalanceForm.getFieldValue('amount')).toBigInt()
    if (
      !amount ||
      !contracts.primaryNativeTerminal.data ||
      !projectId
    )
      return

    setLoadingAddToBalance(true)

    const args = [
      projectId,
      NATIVE_TOKEN,
      amount,
      false, // shouldReturnHeldFees
      '', // memo
      '0x', // metadata
    ] as const

    try {
      const hash = await writeAddToBalance({
        address: contracts.primaryNativeTerminal.data,
        args,
      })

      addTransaction?.('Send payouts', { hash })
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })

      reloadWindow()

      setLoadingAddToBalance(false)
    } catch (e) {
      setLoadingAddToBalance(false)

      emitErrorNotification((e as unknown as Error).message)
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
