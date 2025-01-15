import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import { Button, Tooltip } from 'antd'
import Loading from 'components/Loading'
import { JuiceModal, JuiceModalProps } from 'components/modals/JuiceModal'
import { PV_V4 } from 'constants/pv'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { useProjectLogoSrc } from 'hooks/useProjectLogoSrc'
import { useWallet } from 'hooks/Wallet'
import { NATIVE_TOKEN } from 'juice-sdk-core'
import {
  useJBContractContext,
  useJBTokenContext,
  useWriteJbMultiTerminalCashOutTokensOf,
} from 'juice-sdk-react'
import { useETHReceivedFromTokens } from 'packages/v4/hooks/useETHReceivedFromTokens'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { useCallback, useContext, useMemo, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { formatEther, parseUnits } from 'viem'
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
  const { projectId, projectMetadata } = useProjectMetadataContext()
  const { contracts } = useJBContractContext()
  const { addTransaction } = useContext(TxHistoryContext)

  const wallet = useWallet()
  // TODO: We should probably break out tokens panel hook into reusable module
  const tokenLogo = useProjectLogoSrc({
    projectId,
    pv: PV_V4,
    uri: projectMetadata?.logoUri,
  })

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [fallbackImage, setFallbackImage] = useState<boolean>()
  const [modalOpen, setModalOpen] = useState(false)
  const [redeeming, setRedeeming] = useState(false)

  const redeemAmountWei = parseUnits(
    redeemAmount || '0',
    token?.data?.decimals ?? 18,
  )

  const ethReceivedFromTokens = useETHReceivedFromTokens(redeemAmountWei)
  const tokenFromRedeemAmount = ethReceivedFromTokens
    ? formatEther(ethReceivedFromTokens)
    : ''

  const { writeContractAsync: writeRedeem } =
    useWriteJbMultiTerminalCashOutTokensOf()
  const { userAddress } = useWallet()

  const insufficientBalance = useMemo(() => {
    if (!userTokenBalance) return false
    const amount = Number(redeemAmount || 0)
    const balance = userTokenBalance ?? 0
    return amount > balance
  }, [redeemAmount, userTokenBalance])

  const tokenTicker = tokenSymbol || 'TOKENS'

  // 0.5% slippage for USD-denominated tokens
  const slippage =
    payoutLimit?.currency === V4_CURRENCY_USD
      ? ((ethReceivedFromTokens ?? 0n) * 1000n) / 1005n
      : ethReceivedFromTokens

  const redeem = useCallback(async () => {
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
                image:
                  tokenLogo && !fallbackImage ? (
                    <img
                      src={tokenLogo}
                      alt="Token logo"
                      onError={() => setFallbackImage(true)}
                    />
                  ) : (
                    '🧃'
                  ),
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
            insufficientBalance || redeemAmount === '0' || !redeemAmount
          }
          onClick={redeem}
        >
          {wallet.isConnected ? (
            insufficientBalance ? (
              <Trans>Insufficient balance</Trans>
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
