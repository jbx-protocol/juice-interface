import { Trans, t } from '@lingui/macro'
import { Descriptions, Form } from 'antd'
import {
  useJBChainId,
  useJBContractContext,
  useJBProjectId,
  useJBTokenContext,
  useWriteJbControllerClaimTokensFor,
} from 'juice-sdk-react'
import { useContext, useLayoutEffect, useState } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'

import { WarningOutlined } from '@ant-design/icons'
import { waitForTransactionReceipt } from '@wagmi/core'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import EthereumAddress from 'components/EthereumAddress'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { Ether } from 'juice-sdk-core'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { getChainName } from 'packages/v4/utils/networks'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useChainId } from 'wagmi'
import { useV4YourBalanceMenuItems } from './hooks/useV4YourBalanceMenuItems'

export function V4ClaimTokensModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { contracts } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  const { token } = useJBTokenContext()

  const { unclaimedBalance } = useV4YourBalanceMenuItems()

  const tokenAddress = token?.data?.address
  const tokenSymbol = token?.data?.symbol

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [claimAmount, setClaimAmount] = useState<string>()

  const { userAddress, changeNetworks } = useWallet()

  const { writeContractAsync: writeClaimTokens } =
    useWriteJbControllerClaimTokensFor()

  const chainId = useJBChainId()
  const { projectId } = useJBProjectId()

  const hasIssuedTokens = useProjectHasErc20Token()

  const walletChainId = useChainId()
  const walletConnectedToWrongChain = chainId !== walletChainId

  useLayoutEffect(() => {
    setClaimAmount(fromWad(unclaimedBalance))
  }, [unclaimedBalance])

  async function executeClaimTokensTx() {
    if (
      !contracts.controller.data ||
      !claimAmount ||
      !userAddress ||
      !projectId
    )
      return

    if (walletConnectedToWrongChain) {
      if (chainId) {
        await changeNetworks(chainId)
      }
      return
    }

    setLoading(true)

    const args = [
      userAddress,
      projectId,
      parseWad(claimAmount).toBigInt(),
      userAddress,
    ] as const

    try {
      // SIMULATE TX:
      // const encodedData = encodeFunctionData({
      //   abi: jbControllerAbi,
      //   functionName: 'claimTokensFor',
      //   args,
      // })
      // console.log('encodedData:', encodedData)
      // console.log('contract:', contracts.controller.data)

      const hash = await writeClaimTokens({
        address: contracts.controller.data,
        args,
        chainId,
      })
      setTransactionPending(true)

      addTransaction?.('Claim tokens as ERC20', { hash })
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

  const tokenTextLong = tokenSymbolText({
    tokenSymbol,
    plural: true,
    includeTokenWord: true,
  })

  const tokenTextShort = tokenSymbolText({
    tokenSymbol,
    plural: true,
  })

  if (!chainId) return null

  return (
    <TransactionModal
      title={t`Claim ${getChainName(
        chainId,
      )} ${tokenTextShort} as ERC-20 tokens`}
      connectWalletText={t`Connect wallet to claim`}
      open={open}
      onOk={executeClaimTokensTx}
      okText={
        walletConnectedToWrongChain
          ? t`Change networks to claim`
          : t`Claim ${tokenTextShort}`
      }
      confirmLoading={loading}
      transactionPending={transactionPending}
      okButtonProps={{ disabled: parseWad(claimAmount).eq(0) }}
      onCancel={onCancel}
      width={600}
      centered
    >
      <div className="flex flex-col gap-6">
        {!hasIssuedTokens && (
          <div className="bg-smoke-100 p-2 dark:bg-slate-600">
            <WarningOutlined />{' '}
            <Trans>
              Tokens cannot be claimed because the project owner has not issued
              an ERC-20 for this project.
            </Trans>
          </div>
        )}

        <div>
          <p>
            <Trans>
              Claiming {tokenTextLong} will convert your {tokenTextShort}{' '}
              balance to ERC-20 tokens and mint them to your wallet.
            </Trans>
          </p>
          <p className="font-medium">
            <Trans>
              If you're not sure if you need to claim, you probably don't.
            </Trans>
          </p>
          <p>
            <Trans>
              You can cash out your {tokenTextLong} for ETH without claiming
              them. You can transfer your unclaimed {tokenTextLong} to another
              address from the Tools menu, which can be accessed from the wrench
              icon in the upper right-hand corner of this project.
            </Trans>
          </p>
        </div>

        <Descriptions size="small" layout="horizontal" column={1}>
          <Descriptions.Item
            label={
              <Trans>
                Your unclaimed {getChainName(chainId)} {tokenTextLong}
              </Trans>
            }
          >
            {new Ether(unclaimedBalance ?? 0n).format()} {tokenTextShort}
          </Descriptions.Item>

          {hasIssuedTokens && tokenSymbol && (
            <Descriptions.Item
              label={<Trans>{tokenSymbol} ERC-20 address</Trans>}
            >
              <EthereumAddress address={tokenAddress} chainId={chainId} />
            </Descriptions.Item>
          )}
        </Descriptions>

        <Form layout="vertical">
          <Form.Item
            label={t`Amount of ${getChainName(
              chainId,
            )} ${tokenTextShort} to claim as ERC-20`}
          >
            <FormattedNumberInput
              min={0}
              max={parseFloat(fromWad(unclaimedBalance))}
              disabled={!hasIssuedTokens}
              placeholder="0"
              value={claimAmount}
              accessory={
                <InputAccessoryButton
                  content={t`MAX`}
                  onClick={() => setClaimAmount(fromWad(unclaimedBalance))}
                />
              }
              onChange={val => setClaimAmount(val)}
            />
          </Form.Item>
        </Form>
      </div>
    </TransactionModal>
  )
}
