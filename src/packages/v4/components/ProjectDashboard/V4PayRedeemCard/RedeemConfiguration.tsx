import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { JuiceModal, JuiceModalProps } from 'components/modals/JuiceModal'
import { JB_TOKEN_DECIMALS, NATIVE_TOKEN } from 'juice-sdk-core'
import {
  useJBChainId,
  useJBContractContext,
  useJBProjectId,
  useJBTokenContext,
  useWriteJbMultiTerminalCashOutTokensOf,
} from 'juice-sdk-react'
import { useCallback, useContext, useState } from 'react'
import { formatEther, parseUnits } from 'viem'

import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { waitForTransactionReceipt } from '@wagmi/core'
import Loading from 'components/Loading'
import { useProjectHeaderLogo } from 'components/Project/ProjectHeader/hooks/useProjectHeaderLogo'
import { ProjectHeaderLogo } from 'components/Project/ProjectHeader/ProjectHeaderLogo'
import { wagmiConfig } from 'contexts/Para/Providers'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useWallet } from 'hooks/Wallet'
import { useETHReceivedFromTokens } from 'packages/v4/hooks/useETHReceivedFromTokens'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { emitErrorNotification } from 'utils/notifications'
import { useProjectSelector } from '../redux/hooks'
import { EthereumLogo } from './EthereumLogo'
import { PayRedeemInput } from './PayRedeemInput'

type RedeemConfigurationProps = {
  userTokenBalance: number | undefined
  projectHasErc20Token: boolean
}

export const RedeemConfiguration: React.FC<RedeemConfigurationProps> = ({
  userTokenBalance,
  projectHasErc20Token,
}) => {
  const { token } = useJBTokenContext()
  const tokenSymbol = token?.data?.symbol
  const { data: payoutLimit } = usePayoutLimit()
  const { contracts } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)
  const { projectLogoUri } = useProjectHeaderLogo()

  const wallet = useWallet()
  // TODO: We should probably break out tokens panel hook into reusable module

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [fallbackImage, setFallbackImage] = useState<boolean>()
  const [modalOpen, setModalOpen] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const defaultChainId = useJBChainId()
  const selectedChainId =
    useProjectSelector(state => state.payRedeem.chainId) ?? defaultChainId

  const { projectId } = useJBProjectId(selectedChainId)

  const redeemAmountWei = parseUnits(
    redeemAmount || '0',
    token?.data?.decimals ?? 18,
  )

  const ethReceivedFromTokens = useETHReceivedFromTokens(
    redeemAmountWei,
    selectedChainId,
  )
  const tokenFromRedeemAmount = ethReceivedFromTokens
    ? formatEther(ethReceivedFromTokens)
    : ''

  const { writeContractAsync: writeRedeem } =
    useWriteJbMultiTerminalCashOutTokensOf()
  const { userAddress } = useWallet()

  const insufficientBalance =
    redeemAmountWei >
    parseUnits(userTokenBalance?.toString() ?? '0', JB_TOKEN_DECIMALS)

  const tokenTicker = tokenSymbol || 'TOKENS'

  // 0.5% slippage for USD-denominated tokens
  const slippage =
    payoutLimit?.currency === V4_CURRENCY_USD
      ? ((ethReceivedFromTokens ?? 0n) * 1000n) / 1005n
      : ethReceivedFromTokens

  const redeem = useCallback(async () => {
    if (Number(wallet.chain?.id) !== selectedChainId) {
      wallet.changeNetworks(selectedChainId)
      return
    }

    if (!slippage) {
      emitErrorNotification('Failed to calculate slippage')
      return
    }

    if (!contracts.primaryNativeTerminal.data || !projectId) {
      emitErrorNotification('Failed to prepare transaction')
      return
    }

    if (!userAddress) {
      emitErrorNotification('No wallet connected')
      return
    }

    setRedeeming(true)

    const args = [
      userAddress,
      BigInt(projectId),
      redeemAmountWei,
      NATIVE_TOKEN,
      0n,
      userAddress,
      '0x0',
    ] as const
    try {
      const hash = await writeRedeem({
        chainId: selectedChainId,
        address: contracts.primaryNativeTerminal.data,
        args,
      })
      setModalOpen(true)

      addTransaction?.('Redeem', { hash })

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })
      setRedeeming(false)
    } catch (e) {
      setRedeeming(false)
      setModalOpen(false)
      emitErrorNotification((e as unknown as Error).message)
    }
  }, [
    slippage,
    addTransaction,
    contracts.primaryNativeTerminal.data,
    projectId,
    redeemAmountWei,
    userAddress,
    writeRedeem,
    selectedChainId,
    wallet,
  ])

  return (
    <>
      <div>
        <div className="relative">
          <div className="flex flex-col gap-y-2">
            <PayRedeemInput
              label={
                <Tooltip
                  title={t`Cash out your tokens for a portion of this project's treasury`}
                >
                  {t`You cash out`}
                </Tooltip>
              }
              token={{
                balance: userTokenBalance?.toString(),
                image: <ProjectHeaderLogo className="h-full w-full" />,
                ticker: tokenTicker,
                type: projectHasErc20Token ? 'erc20' : 'native',
              }}
              value={redeemAmount}
              onChange={setRedeemAmount}
            />
            <PayRedeemInput
              label={t`You receive`}
              downArrow
              readOnly
              token={{
                balance: wallet.balance,
                image: <EthereumLogo />,
                ticker: 'ETH',
                type: 'eth',
              }}
              value={tokenFromRedeemAmount}
            />
          </div>
        </div>

        <Button
          type="primary"
          className="mt-6 w-full"
          size="large"
          loading={redeeming}
          disabled={
            insufficientBalance ||
            redeemAmount === '0' ||
            !redeemAmount ||
            !tokenFromRedeemAmount ||
            tokenFromRedeemAmount === '0'
          }
          onClick={redeem}
        >
          {wallet.isConnected ? (
            insufficientBalance ? (
              <Trans>Insufficient balance</Trans>
            ) : Number(wallet.chain?.id) !== selectedChainId ? (
              <Trans>Change networks to cash out</Trans>
            ) : (
              <Trans>Cash out {tokenTicker}</Trans>
            )
          ) : (
            <Trans>Connect wallet to cash out</Trans>
          )}
        </Button>
      </div>
      <RedeemModal
        open={modalOpen}
        setOpen={setModalOpen}
        redeeming={redeeming}
      />
    </>
  )
}

const RedeemModal: React.FC<JuiceModalProps & { redeeming: boolean }> = ({
  redeeming,
  ...props
}) => {
  return (
    <JuiceModal {...props} hideCancelButton hideOkButton>
      <div className="mx-auto flex flex-col items-center justify-center">
        {redeeming ? (
          <>
            <Loading />
            <h2 className="mt-8">
              <Trans>Redeeming tokens</Trans>
            </h2>
            <div>
              <Trans>Your transaction is processing.</Trans>
            </div>
            <div>
              <Trans>You can safely close this modal.</Trans>
            </div>
          </>
        ) : (
          <>
            <div className="rouncded-full flex h-20 w-20 items-center justify-center bg-melon-100 dark:bg-melon-950">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-melon-200 dark:bg-melon-900">
                <CheckCircleIcon className="h-10 w-10 text-melon-700 dark:text-melon-500" />
              </div>
            </div>
            <h2 className="mt-4">
              <Trans>Success!</Trans>
            </h2>
            <div>
              <Trans>Your transaction was successful.</Trans>
            </div>
            <div>
              <Trans>You can safely close this modal.</Trans>
            </div>
          </>
        )}
      </div>
    </JuiceModal>
  )
}
