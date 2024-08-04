import { Button } from 'antd'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { NATIVE_TOKEN, NATIVE_TOKEN_DECIMALS } from 'juice-sdk-core'
import {
  useJBContractContext,
  useWriteJbMultiTerminalPay,
} from 'juice-sdk-react'
import { useContext, useState } from 'react'
import { parseUnits } from 'viem'

// TODO wildly incomplete. Needs full redo
export function V4PayRedeemCard({ className }: { className: string }) {
  const [value, setValue] = useState<string>('0.0001')

  const { contracts, projectId } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)
  const { userAddress } = useWallet()

  const valuePayload = value ? parseUnits(value, NATIVE_TOKEN_DECIMALS) : 0n

  const { writeContractAsync: writePay } = useWriteJbMultiTerminalPay()

  const onWrite = async () => {
    if (!value || !contracts.primaryNativeTerminal.data || !userAddress) {
      return
    }

    const args = [
      projectId,
      NATIVE_TOKEN,
      valuePayload,
      userAddress,
      0n,
      `JBM V4 ${projectId}`, // TODO update
      '0x0',
    ] as const

    const txHash = await writePay({
      address: contracts.primaryNativeTerminal.data,
      args,
      value: valuePayload,
    })

    addTransaction?.('Pay', { hash: txHash })
  }

  return (
    <div className={className}>
      <Button onClick={onWrite}>Pay</Button>
    </div>
  )
}
