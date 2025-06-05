import { Form, Input } from 'antd'
import {
  JBChainId,
  useJBChainId,
  useJBProjectId,
  useReadJbDirectoryControllerOf,
  useReadJbTokensTokenOf,
  useSuckers,
  useWriteJbControllerMintTokensOf
} from 'juice-sdk-react'
import { useContext, useState } from 'react'

import { isAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import { useForm } from 'antd/lib/form/Form'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { NETWORKS } from 'constants/networks'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import useNameOfERC20 from 'hooks/ERC20/useNameOfERC20'
import { useWallet } from 'hooks/Wallet'
import { ChainSelect } from 'packages/v4/components/ChainSelect'
import { getWagmiConfig } from '@getpara/evm-wallet-connectors';
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
  
  const defaultChainId = useJBChainId()
  const [selectedChainId, setSelectedChainId] = useState<JBChainId | undefined>(
    defaultChainId,
  )

  const { addTransaction } = useContext(TxHistoryContext)
  const { projectId } = useJBProjectId(selectedChainId)
  const { data: suckers } = useSuckers()

  const { data: controllerAddress } = useReadJbDirectoryControllerOf({
    chainId: selectedChainId,
    args: [BigInt(projectId ?? 0)],
  })

  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: tokenSymbol } = useNameOfERC20(tokenAddress)

  const { chain: walletChain, changeNetworks, connect } = useWallet()
  const walletChainId = walletChain?.id ? parseInt(walletChain.id) : undefined
  
  const walletConnectedToWrongChain = selectedChainId !== walletChainId

  async function executeMintTx() {
    const formValues = form.getFieldsValue(true) as MintForm
    const amount = parseWad(formValues.amount ?? '0').toBigInt()
    const memo = formValues.memo
    const beneficiary = formValues.beneficary as Address

    if (!controllerAddress || !beneficiary || !amount || !projectId || !selectedChainId)
      return

    // Check if wallet is connected to wrong chain
    if (walletConnectedToWrongChain) {
      try {
        await changeNetworks(selectedChainId as JBChainId)
        return
      } catch (e) {
        emitErrorNotification((e as unknown as Error).message)
        return
      }
    }
    
    if (!walletChain) {
      await connect()
      return
    }

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
        address: controllerAddress,
        chainId: selectedChainId,
        args,
      })
      setTransactionPending(true)

      addTransaction?.(`Mint tokens on ${NETWORKS[selectedChainId]?.label}`, {
        hash,
      })
      const wagmiConfig = getWagmiConfig();
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: selectedChainId,
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
      okText={
        walletConnectedToWrongChain
          ? t`Change networks to mint tokens`
          : t`Mint ${tokensTokenLower}`
      }
      connectWalletText={t`Connect wallet to mint tokens`}
    >
      <p>Mint new tokens to a specified address.</p>

      <Form layout="vertical" form={form}>
        {suckers && suckers.length > 1 ? (
          <Form.Item className="mb-4" label={t`Chain`}>
            <ChainSelect
              value={selectedChainId}
              onChange={setSelectedChainId}
              chainIds={suckers.map(s => s.peerChainId)}
              showTitle
            />
          </Form.Item>
        ) : null}
        
        <Form.Item
          label={t`Token receiver`}
          name="beneficary"
          rules={[
            {
              required: true,
              validateTrigger: 'onCreate',
              validator: (rule, value) => {
                if (!value || !isAddress(value))
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
