import { Trans, t } from '@lingui/macro'
import { Descriptions, Form } from 'antd'
import { Ether, JBChainId } from 'juice-sdk-core'
import {
  useJBChainId,
  useJBProjectId,
  useJBTokenContext,
  useSuckers,
} from 'juice-sdk-react'
import { jbDirectoryAbi, jbTokensAbi, jbControllerAbi, JBCoreContracts, jbContractAddress } from 'juice-sdk-core'
import { useReadContract, useWriteContract } from 'wagmi'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'

import { WarningOutlined } from '@ant-design/icons'
import { waitForTransactionReceipt } from '@wagmi/core'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import EthereumAddress from 'components/EthereumAddress'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { wagmiConfig } from 'contexts/Para/Providers'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { ChainSelect } from 'packages/v4/components/ChainSelect'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { getChainName } from 'packages/v4/utils/networks'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { zeroAddress } from 'viem'
import { useChainId } from 'wagmi'

export function V4ClaimTokensModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { addTransaction } = useContext(TxHistoryContext)

  const { token } = useJBTokenContext()
  const { userAddress, changeNetworks } = useWallet()

  // Chain selection state
  const defaultChainId = useJBChainId()
  const [selectedChainId, setSelectedChainId] = useState<JBChainId>(defaultChainId!)
  const { data: suckers } = useSuckers()

  // Reset to default chain when modal opens
  useEffect(() => {
    if (open && defaultChainId) {
      setSelectedChainId(defaultChainId)
    }
  }, [open, defaultChainId])

  // Get data for the selected chain
  const { projectId } = useJBProjectId(selectedChainId)

  // Get controller address for the selected chain
  const { data: controllerAddress } = useReadContract({
    abi: jbDirectoryAbi,
    address: jbContractAddress['4'][JBCoreContracts.JBDirectory][selectedChainId],
    functionName: 'controllerOf',
    args: [projectId ?? 0n],
    chainId: selectedChainId,
  })

  // Get unclaimed balance for selected chain
  const { data: unclaimedBalance } = useReadContract({
    abi: jbTokensAbi,
    address: jbContractAddress['4'][JBCoreContracts.JBTokens][selectedChainId],
    functionName: 'creditBalanceOf',
    args: [userAddress ?? zeroAddress, projectId ?? 0n],
    chainId: selectedChainId
  })

  const tokenAddress = token?.data?.address
  const tokenSymbol = token?.data?.symbol

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [claimAmount, setClaimAmount] = useState<string>()

  const { writeContractAsync: writeClaimTokens } = useWriteContract()

  const hasIssuedTokens = useProjectHasErc20Token()

  const walletChainId = useChainId()
  const walletConnectedToWrongChain = selectedChainId !== walletChainId

  useLayoutEffect(() => {
    setClaimAmount(fromWad(unclaimedBalance))
  }, [unclaimedBalance])

  async function executeClaimTokensTx() {
    if (
      !controllerAddress ||
      !claimAmount ||
      !userAddress ||
      !projectId
    )
      return

    if (walletConnectedToWrongChain) {
      if (selectedChainId) {
        await changeNetworks(selectedChainId)
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
        address: controllerAddress,
        abi: jbControllerAbi,
        functionName: 'claimTokensFor',
        args,
        chainId: selectedChainId,
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

  if (!selectedChainId) return null

  return (
    <TransactionModal
      title={t`Claim ${tokenTextShort} as ERC-20 tokens`}
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

        {suckers && suckers.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Chain:</span>
            <ChainSelect
              className="min-w-[175px]"
              value={selectedChainId}
              onChange={setSelectedChainId}
              chainIds={suckers.map(sucker => sucker.peerChainId)}
              showTitle
            />
          </div>
        )}

        <Descriptions size="small" layout="horizontal" column={1}>
          <Descriptions.Item
            label={
              <Trans>
                Your unclaimed {getChainName(selectedChainId)} {tokenTextLong}
              </Trans>
            }
          >
            {new Ether(unclaimedBalance ?? 0n).format()} {tokenTextShort}
          </Descriptions.Item>

          {hasIssuedTokens && tokenSymbol && (
            <Descriptions.Item
              label={<Trans>{tokenSymbol} ERC-20 address</Trans>}
            >
              <EthereumAddress address={tokenAddress} chainId={selectedChainId} />
            </Descriptions.Item>
          )}
        </Descriptions>

        <Form layout="vertical">
          <Form.Item
            label={t`Amount of ${getChainName(
              selectedChainId,
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
