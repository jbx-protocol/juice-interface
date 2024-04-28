import { ArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { Callout } from 'components/Callout/Callout'
import Loading from 'components/Loading'
import { EthereumIcon } from 'components/icons/Ethereum'
import { JuiceModal, JuiceModalProps } from 'components/modals/JuiceModal'
import { PV_V2 } from 'constants/pv'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectLogoSrc } from 'hooks/useProjectLogoSrc'
import { useETHReceivedFromTokens } from 'hooks/v2v3/contractReader/useETHReceivedFromTokens'
import { useRedeemTokensTx } from 'hooks/v2v3/transactor/useRedeemTokensTx'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { formatAmount } from 'utils/format/formatAmount'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { computeIssuanceRate } from 'utils/v2v3/math'
import { useProjectCart } from '../hooks/useProjectCart'
import { useProjectContext } from '../hooks/useProjectContext'
import { useTokensPanel } from '../hooks/useTokensPanel'
import { useTokensPerEth } from '../hooks/useTokensPerEth'
import { useCartSummary } from './Cart/hooks/useCartSummary'

const MAX_AMOUNT = BigInt(Number.MAX_SAFE_INTEGER)

type PayerIssuanceRate = {
  loading: boolean
  enabled: boolean
}

type Redeems = {
  loading: boolean
  enabled: boolean
}

export type PayRedeemCardProps = {
  className?: string
}

export const PayRedeemCard: React.FC<PayRedeemCardProps> = ({ className }) => {
  const project = useProjectContext()
  const [state, setState] = useState<'pay' | 'redeem'>('pay')
  // TODO: We should probably break out tokens panel hook into reusable module
  const { userTokenBalance: panelBalance } = useTokensPanel()

  project.fundingCycleMetadata?.pauseRedeem

  const tokenBalance = useMemo(() => {
    return panelBalance
      ? parseFloat(panelBalance.replaceAll(',', ''))
      : undefined
  }, [panelBalance])

  const payerIssuanceRate = useMemo<PayerIssuanceRate>(() => {
    if (!project.fundingCycle || !project.fundingCycleMetadata) {
      return {
        loading: project.loading.fundingCycleLoading,
        enabled: false,
      }
    }
    const weightAmount = computeIssuanceRate(
      project.fundingCycle,
      project.fundingCycleMetadata,
      'payer',
      false,
    )
    const hasPayerIssuanceRate = Number(weightAmount) > 0
    return {
      loading: project.loading.fundingCycleLoading,
      enabled: hasPayerIssuanceRate,
    }
  }, [
    project.fundingCycle,
    project.fundingCycleMetadata,
    project.loading.fundingCycleLoading,
  ])

  const redeems = useMemo<Redeems>(() => {
    return {
      loading: project.loading.fundingCycleLoading,
      enabled: !project.fundingCycleMetadata?.pauseRedeem || false,
    }
  }, [
    project.fundingCycleMetadata?.pauseRedeem,
    project.loading.fundingCycleLoading,
  ])

  return (
    <div className="flex flex-col">
      <div
        className={twMerge(
          'flex flex-col rounded-lg border border-grey-200 p-5 pb-6 dark:border-slate-600 dark:bg-slate-700',
          className,
        )}
      >
        <div>
          <ChoiceButton
            selected={state === 'pay'}
            onClick={() => setState('pay')}
          >
            Pay
          </ChoiceButton>
          <ChoiceButton
            selected={state === 'redeem'}
            onClick={() => setState('redeem')}
            disabled={!redeems.enabled}
          >
            Redeem
          </ChoiceButton>
        </div>

        <div className="mt-5">
          {state === 'pay' ? (
            <PayConfiguration
              userTokenBalance={tokenBalance}
              payerIssuanceRate={payerIssuanceRate}
            />
          ) : (
            <RedeemConfiguration userTokenBalance={tokenBalance} />
          )}
        </div>
      </div>

      {/* Extra matter */}
      {!payerIssuanceRate.enabled && !payerIssuanceRate.loading && (
        <Callout.Info className="mt-6 py-2 px-3.5" collapsible={false}>
          <Trans>This project does not currently offer tokens</Trans>
        </Callout.Info>
      )}
    </div>
  )
}

const ChoiceButton = ({
  children,
  onClick,
  selected,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
}) => {
  const Button = useMemo(
    () => (
      <button
        disabled={disabled}
        onClick={onClick}
        className={twMerge(
          'w-fit rounded-full px-4 py-1.5 text-base font-medium transition-colors',
          selected
            ? 'bg-grey-100 text-grey-900 dark:bg-slate-900 dark:text-slate-100'
            : !disabled
            ? 'bg-transparent text-grey-500 hover:bg-grey-100 hover:text-grey-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100'
            : 'cursor-not-allowed text-grey-400 dark:text-slate-300',
        )}
      >
        {children}
      </button>
    ),
    [children, disabled, onClick, selected],
  )
  if (disabled) {
    return <Tooltip title={t`Disabled for this project`}>{Button}</Tooltip>
  }
  return Button
}

const PayRedeemInput = ({
  className,
  label,
  readOnly,
  token,
  value,
  onChange,
}: {
  className?: string
  label?: string
  readOnly?: boolean
  token: {
    type?: 'eth' | 'other'
    ticker: string
    image: ReactNode
    balance: string | undefined
  }
  value?: string | undefined
  onChange?: (value: string | undefined) => void
}) => {
  token.type = token.type || 'other'

  const converter = useCurrencyConverter()

  const convertedValue = useMemo(() => {
    if (!value || token.type !== 'eth') return undefined
    const usdPerEth = converter.usdPerEth
    const n = parseFloat(value)
    if (Number.isNaN(n)) return undefined
    const amount = usdPerEth ? n * usdPerEth : undefined
    return {
      amount,
      currency: V2V3_CURRENCY_USD,
    }
  }, [converter, token.type, value])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // only allow numbers and decimals
    let value = event.target.value.replace(/[^0-9.]/g, '')
    // If value contains more than one decimal point, remove the last one
    if (value.split('.').length > 2) {
      const idx = value.lastIndexOf('.')
      value = value.slice(0, idx) + value.slice(idx + 1)
    }
    let num
    try {
      num = BigInt(value)
    } catch (e) {
      console.warn('Invalid number', e)
      return onChange?.(value)
    }
    if (num > MAX_AMOUNT) return onChange?.(MAX_AMOUNT.toString())

    return onChange?.(value)
  }

  const handleBlur = () => {
    if (value?.endsWith('.')) {
      onChange?.(value.slice(0, -1))
    }
  }

  return (
    <div
      className={twMerge(
        'flex flex-col gap-y-2 overflow-hidden rounded-lg border border-grey-200 bg-grey-50 px-4 py-3 text-sm text-grey-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200',
        className,
      )}
    >
      <label>{label}</label>
      <div className="flex w-full justify-between gap-2">
        <input
          className="min-w-0 bg-transparent text-3xl font-medium text-grey-900 placeholder:text-grey-300 focus:outline-none dark:text-slate-100 dark:placeholder-slate-400"
          // TODO: Format and de-format
          value={value}
          placeholder="0"
          readOnly={readOnly}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <TokenBadge token={token.ticker} image={token.image} />
      </div>
      <div className="flex min-h-[22px] justify-between">
        <span>{convertedValue && formatCurrencyAmount(convertedValue)}</span>
        <span>
          {token.balance && <>Balance: {formatAmount(token.balance)}</>}
        </span>
      </div>
    </div>
  )
}

const TokenBadge = ({
  className,
  token,
  image,
}: {
  className?: string
  token: string
  image: ReactNode
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-full border border-grey-200 bg-white py-1 px-1.5 pr-3 text-base font-medium text-grey-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100',
        className,
      )}
    >
      <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-grey-200">
        {image}
      </div>
      {token}
    </div>
  )
}

const DownArrow = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-grey-50 p-1 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex items-center justify-center rounded-lg border border-grey-200 bg-white p-2 dark:border-slate-600 dark:bg-slate-600">
        <ArrowDownIcon className="h-4 w-4 stroke-2 text-grey-400 dark:text-slate-300" />
      </div>
    </div>
  )
}

type PayConfigurationProps = {
  userTokenBalance: number | undefined
  payerIssuanceRate: PayerIssuanceRate
}

const PayConfiguration: React.FC<PayConfigurationProps> = ({
  userTokenBalance,
  payerIssuanceRate,
}) => {
  const { tokenSymbol } = useProjectContext()
  const cart = useProjectCart()
  const wallet = useWallet()
  // TODO: We should probably break out tokens panel hook into reusable module
  const { payProject, walletConnected } = useCartSummary()
  const { projectId, projectMetadata } = useProjectMetadataContext()

  const [payAmount, setPayAmount] = useState<string>()
  const [fallbackImage, setFallbackImage] = useState<boolean>()

  const tokenLogo = useProjectLogoSrc({
    projectId,
    pv: PV_V2,
    uri: projectMetadata?.logoUri,
  })
  const tokenReceivedAmount = useTokensPerEth({
    amount: parseFloat(payAmount || '0'),
    currency: V2V3_CURRENCY_ETH,
  })
  const insufficientBalance = useMemo(() => {
    if (!wallet.balance) return false
    const amount = parseFloat(payAmount || '0')
    const balance = parseFloat(wallet.balance)
    return amount > balance
  }, [payAmount, wallet.balance])

  const tokenTicker = tokenSymbol || 'TOKENS'

  useEffect(() => {
    cart.dispatch({
      type: 'addPayment',
      payload: {
        amount: parseFloat(payAmount || '0'),
        currency: V2V3_CURRENCY_ETH,
      },
    })

    return () => {
      cart.dispatch({
        type: 'removePayment',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payAmount])

  return (
    <div>
      <div className="relative">
        <div className="flex flex-col gap-y-2">
          <PayRedeemInput
            label={t`You pay`}
            token={{
              balance: wallet.balance,
              image: <EthereumLogo />,
              ticker: 'ETH',
              type: 'eth',
            }}
            value={payAmount}
            onChange={setPayAmount}
          />
          {payerIssuanceRate.enabled && (
            <PayRedeemInput
              label={t`You receive`}
              readOnly
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
              }}
              value={
                tokenReceivedAmount.receivedTickets &&
                !!parseFloat(tokenReceivedAmount.receivedTickets)
                  ? tokenReceivedAmount.receivedTickets
                  : ''
              }
            />
          )}
        </div>
        {payerIssuanceRate.enabled && (
          <DownArrow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>

      <Button
        type="primary"
        className="mt-6 w-full"
        size="large"
        disabled={insufficientBalance || payAmount === '0' || !payAmount}
        onClick={payProject}
      >
        {walletConnected ? (
          insufficientBalance ? (
            <Trans>Insufficient balance</Trans>
          ) : (
            <Trans>Pay project</Trans>
          )
        ) : (
          <Trans>Connect wallet to pay</Trans>
        )}
      </Button>
    </div>
  )
}

type RedeemConfigurationProps = {
  userTokenBalance: number | undefined
}

const RedeemConfiguration: React.FC<RedeemConfigurationProps> = ({
  userTokenBalance,
}) => {
  const { tokenSymbol, distributionLimitCurrency } = useProjectContext()
  const { projectId, projectMetadata } = useProjectMetadataContext()
  const redeemTokensTx = useRedeemTokensTx()
  const wallet = useWallet()
  // TODO: We should probably break out tokens panel hook into reusable module
  const tokenLogo = useProjectLogoSrc({
    projectId,
    pv: PV_V2,
    uri: projectMetadata?.logoUri,
  })

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [fallbackImage, setFallbackImage] = useState<boolean>()
  const [modalOpen, setModalOpen] = useState(false)
  const [redeeming, setRedeeming] = useState(false)

  const ethReceivedFromTokens = useETHReceivedFromTokens({
    tokenAmount: redeemAmount,
  })

  const tokenFromRedeemAmount = useMemo(() => {
    if (!redeemAmount) return ''
    return formatCurrencyAmount({
      amount: fromWad(ethReceivedFromTokens),
      currency: V2V3_CURRENCY_ETH,
    })
  }, [ethReceivedFromTokens, redeemAmount])

  const insufficientBalance = useMemo(() => {
    if (!userTokenBalance) return false
    const amount = Number(redeemAmount || 0)
    const balance = userTokenBalance ?? 0
    return amount > balance
  }, [redeemAmount, userTokenBalance])
  const tokenTicker = tokenSymbol || 'TOKENS'

  // 0.5% slippage for USD-denominated tokens
  const slippage = useMemo(() => {
    if (distributionLimitCurrency?.eq(V2V3_CURRENCY_USD)) {
      return ethReceivedFromTokens?.mul(1000).div(1005)
    }
    return ethReceivedFromTokens
  }, [distributionLimitCurrency, ethReceivedFromTokens])

  const redeem = useCallback(async () => {
    if (!slippage) {
      emitErrorNotification('Failed to calculate slippage')
      return
    }
    setRedeeming(true)
    const txSuccess = await redeemTokensTx(
      {
        redeemAmount: parseWad(redeemAmount),
        minReturnedTokens: slippage,
        memo: '',
      },
      {
        onDone: () => {
          setModalOpen(true)
        },
        onConfirmed: () => {
          setRedeeming(false)
        },
        onError: (e: Error) => {
          setRedeeming(false)
          setModalOpen(false)
          emitErrorNotification(e.message)
        },
      },
    )
    if (!txSuccess) {
      setRedeeming(false)
      setModalOpen(false)
    }
  }, [redeemAmount, redeemTokensTx, slippage])

  return (
    <>
      <div>
        <div className="relative">
          <div className="flex flex-col gap-y-2">
            <PayRedeemInput
              label={t`You redeem`}
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
              }}
              value={redeemAmount}
              onChange={setRedeemAmount}
            />
            <PayRedeemInput
              label={t`You receive`}
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
          <DownArrow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
              <Trans>Redeem {tokenTicker}</Trans>
            )
          ) : (
            <Trans>Connect wallet to redeem</Trans>
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
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-melon-100 dark:bg-melon-950">
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

        {/* <ExternalLink className="mt-3">View on block explorer</ExternalLink> */}
      </div>
    </JuiceModal>
  )
}

const EthereumLogo = () => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-bluebs-500">
      <EthereumIcon className="text-white" />
    </div>
  )
}
