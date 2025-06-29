import { JBChainId, NATIVE_TOKEN } from 'juice-sdk-core'
import { useJBChainId, useJBContractContext, useJBProjectId, useSuckers, useWriteJbMultiTerminalAddToBalanceOf } from 'juice-sdk-react'
import { useContext, useState } from 'react'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'

import { Trans } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import { Form } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import TransactorButton from 'components/buttons/TransactorButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { wagmiConfig } from 'contexts/Para/Providers'
import { parseWad } from 'utils/format/formatNumber'
import { ChainSelect } from '../../../../components/ChainSelect'

export function AddToProjectBalanceForm() {
  const defaultChainId = useJBChainId()
  const { data: suckers } = useSuckers()
  const [selectedChainId, setSelectedChainId] = useState<JBChainId | undefined>(defaultChainId)
  const { contracts } = useJBContractContext()

  const { projectId } = useJBProjectId(selectedChainId)
  const { addTransaction } = useContext(TxHistoryContext)

  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()

  const { userAddress, chain: walletChain, changeNetworks, isConnected } = useWallet()
  const walletChainId = walletChain?.id ? parseInt(walletChain.id) : undefined
  const walletConnectedToWrongChain = isConnected && selectedChainId !== walletChainId

  const [addToBalanceForm] = Form.useForm<{ amount: string }>()

  const { writeContractAsync: writeAddToBalance } =
  useWriteJbMultiTerminalAddToBalanceOf()
  
  const handleChainChange = (chainId: JBChainId) => {
    setSelectedChainId(chainId)
  }

  async function handleNetworkChange() {
    await changeNetworks(selectedChainId)
    emitInfoNotification(`Network changed to ${selectedChainId}, please try again.`)
  }

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
        chainId: selectedChainId,
      })

      addTransaction?.('Add to balance', { hash })
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })

      emitInfoNotification(`Transaction successful!`)
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
      
      {suckers && suckers.length > 1 && (
        <Form.Item label={<Trans>Network</Trans>}>
          <ChainSelect
            className="w-full"
            value={selectedChainId}
            onChange={handleChainChange}
            chainIds={suckers.map(sucker => sucker.peerChainId)}
            showTitle
          />
        </Form.Item>
      )}

      <Form.Item name="amount" label={<Trans>Transfer amount</Trans>}>
        <FormattedNumberInput
          placeholder="0"
          accessory={<InputAccessoryButton content="ETH" />}
        />
      </Form.Item>
      <TransactorButton
        onClick={walletConnectedToWrongChain ? handleNetworkChange : addToBalance}
        loading={loadingAddToBalance}
        size="small"
        type="primary"
        text={
          walletConnectedToWrongChain
            ? <Trans>Change network to transfer</Trans>
            : <Trans>Transfer ETH to project</Trans>
        }
        disabled={!userAddress}
        connectWalletText={<Trans>Connect wallet to transfer ETH</Trans>}
      />
    </Form>
  )
}