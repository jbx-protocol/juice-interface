import {
  ArrowDownIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { JuiceModal, JuiceModalProps } from 'components/modals/JuiceModal'
import {
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'packages/v2v3/utils/currency'
import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import {
  useProjectDispatch,
  useProjectSelector,
  useProjectStore,
} from '../../redux/hooks'

import { Callout } from 'components/Callout/Callout'
import { CartItemBadge } from 'components/CartItemBadge'
import { EthereumIcon } from 'components/icons/Ethereum'
import Loading from 'components/Loading'
import { SmallNftSquare } from 'components/NftRewards/SmallNftSquare'
import { TruncatedText } from 'components/TruncatedText'
import { PV_V2 } from 'constants/pv'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { emitConfirmationDeletionModal } from 'hooks/emitConfirmationDeletionModal'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectLogoSrc } from 'hooks/useProjectLogoSrc'
import { useWallet } from 'hooks/Wallet'
import { NftRewardTier } from 'models/nftRewards'
import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import { useETHReceivedFromTokens } from 'packages/v2v3/hooks/contractReader/useETHReceivedFromTokens'
import { useHasNftRewards } from 'packages/v2v3/hooks/JB721Delegate/useHasNftRewards'
import { useRedeemTokensTx } from 'packages/v2v3/hooks/transactor/useRedeemTokensTx'
import { usePayProjectDisabled } from 'packages/v2v3/hooks/usePayProjectDisabled'
import { formatCurrencyAmount } from 'packages/v2v3/utils/formatCurrencyAmount'
import { isInfiniteDistributionLimit } from 'packages/v2v3/utils/fundingCycle'
import { computeIssuanceRate } from 'packages/v2v3/utils/math'
import { twMerge } from 'tailwind-merge'
import { formatAmount } from 'utils/format/formatAmount'
import { emitErrorNotification } from 'utils/notifications'
import { NftCreditsCallout } from '../../../NftCreditsCallout'
import { useNftCartItem } from '../../hooks/useNftCartItem'
import { useProjectContext } from '../../hooks/useProjectContext'
import { useProjectHasErc20Token } from '../../hooks/useProjectHasErc20Token'
import { useProjectPageQueries } from '../../hooks/useProjectPageQueries'
import { useTokensPanel } from '../../hooks/useTokensPanel'
import { useTokensPerEth } from '../../hooks/useTokensPerEth'
import { useUnclaimedTokenBalance } from '../../hooks/useUnclaimedTokenBalance'
import { payRedeemActions } from '../../redux/payRedeemSlice'
import { projectCartActions } from '../../redux/projectCartSlice'
import { ClaimErc20Callout } from '../ClaimErc20Callout'
import { EthPerTokenAccordion } from '../EthPerTokenAccordion'
import { ProjectCartNftReward } from '../ReduxProjectCartProvider'
import { FirstCycleCountdownCallout } from './FirstCycleCountdownCallout'
import { PayProjectModal } from './PayProjectModal/PayProjectModal'
import { PreventOverspendingPayCard } from './PreventOverspendingPayCard'

const MAX_AMOUNT = BigInt(Number.MAX_SAFE_INTEGER)

type PayerIssuanceRate = {
  loading: boolean
  enabled: boolean
}

type Redeems = {
  loading: boolean
  enabled: boolean
}

type PayRedeemCardProps = {
  className?: string
}

export const PayRedeemCard: React.FC<PayRedeemCardProps> = ({ className }) => {
  const project = useProjectContext()
  const metadata = useProjectMetadataContext()
  const state = useProjectSelector(state => state.payRedeem.cardState)
  const dispatch = useProjectDispatch()
  // TODO: We should probably break out tokens panel hook into reusable module
  const { userTokenBalance: panelBalance } = useTokensPanel()
  const unclaimedTokenBalance = useUnclaimedTokenBalance()
  const projectHasErc20Token = useProjectHasErc20Token()
  const { value: hasNfts, loading: hasNftsLoading } = useHasNftRewards()

  const tokenBalance = panelBalance
    ? parseFloat(panelBalance.replaceAll(',', ''))
    : undefined

  const fundingCycleLoading =
    project.loading.fundingCycleLoading ||
    !project.fundingCycle ||
    !project.fundingCycleMetadata

  const payerIssuanceRate = useMemo<PayerIssuanceRate>(() => {
    if (!project.fundingCycle || !project.fundingCycleMetadata) {
      return {
        loading: fundingCycleLoading,
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
      loading: fundingCycleLoading,
      enabled: hasPayerIssuanceRate,
    }
  }, [project.fundingCycle, project.fundingCycleMetadata, fundingCycleLoading])

  const redeems = {
    loading: fundingCycleLoading,
    enabled: !project.fundingCycleMetadata?.pauseRedeem || false,
  }

  const noticeText = useMemo(() => {
    if (project.fundingCycle?.number?.isZero()) {
      return
    }
    const showPayerIssuance =
      !payerIssuanceRate.enabled && !payerIssuanceRate.loading
    if (!showPayerIssuance) {
      return
    }

    const showNfts = hasNfts && !hasNftsLoading
    if (showNfts) {
      return t`${metadata.projectMetadata?.name} is currently only issuing NFTs`
    }

    return t`${metadata.projectMetadata?.name} isn't currently issuing tokens`
  }, [
    payerIssuanceRate,
    hasNfts,
    hasNftsLoading,
    metadata,
    project.fundingCycle,
  ])

  const redeemDisabled =
    project.fundingCycle?.number?.isZero() ||
    project.fundingCycleMetadata?.redemptionRate.eq(0) ||
    isInfiniteDistributionLimit(project.distributionLimit)

  return (
    <div className={twMerge('flex flex-col', className)}>
      <div
        className={twMerge(
          'flex flex-col rounded-lg border border-grey-200 bg-white p-5 pb-6 shadow-[0_6px_16px_0_rgba(0,_0,_0,_0.04)] dark:border-slate-600 dark:bg-slate-700',
        )}
      >
        <div>
          <ChoiceButton
            selected={state === 'pay'}
            onClick={() => dispatch(payRedeemActions.changeToPay())}
          >
            <Trans>Pay</Trans>
          </ChoiceButton>
          {redeemDisabled ? null : (
            <ChoiceButton
              selected={state === 'redeem'}
              tooltip={t`Redeem tokens for a portion of this project's treasury`}
              onClick={() => {
                dispatch(payRedeemActions.changeToRedeem())
              }}
              disabled={!redeems.enabled}
            >
              <Trans>Redeem</Trans>
            </ChoiceButton>
          )}
        </div>

        <div className="mt-5">
          {state === 'pay' ? (
            <PayConfiguration
              userTokenBalance={tokenBalance}
              projectHasErc20Token={projectHasErc20Token}
              payerIssuanceRate={payerIssuanceRate}
            />
          ) : (
            <RedeemConfiguration
              userTokenBalance={tokenBalance}
              projectHasErc20Token={projectHasErc20Token}
            />
          )}
        </div>
      </div>

      <EthPerTokenAccordion />

      {!payerIssuanceRate.enabled &&
        !payerIssuanceRate.loading &&
        noticeText && (
          <Callout.Info
            className="mt-6 py-2 px-3.5 text-sm leading-5 dark:bg-slate-700"
            collapsible={false}
            icon={<InformationCircleIcon className="h-5 w-5" />}
          >
            {noticeText}
          </Callout.Info>
        )}

      <NftCreditsCallout />

      {projectHasErc20Token && unclaimedTokenBalance?.gt(0) && (
        <ClaimErc20Callout className="mt-4" unclaimed={unclaimedTokenBalance} />
      )}

      <PayProjectModal />
    </div>
  )
}

const ChoiceButton = ({
  children,
  onClick,
  selected,
  tooltip,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
  tooltip?: ReactNode
  disabled?: boolean
}) => {
  if (disabled) {
    tooltip = t`Disabled for this project`
  }
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
  return <Tooltip title={tooltip}>{Button}</Tooltip>
}

const PayRedeemInput = ({
  className,
  label,
  downArrow,
  readOnly,
  redeemUnavailable,
  token,
  cartNfts,
  value,
  onChange,
}: {
  className?: string
  label?: ReactNode
  downArrow?: boolean
  readOnly?: boolean
  redeemUnavailable?: boolean
  token: {
    type?: 'eth' | 'native' | 'erc20'
    ticker: string
    image: ReactNode
    balance: string | undefined
  }
  cartNfts?: ProjectCartNftReward[]
  value?: string | undefined
  onChange?: (value: string | undefined) => void
}) => {
  const {
    nftRewards: { rewardTiers: nfts },
  } = useContext(NftRewardsContext)

  token.type = token.type || 'native'

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

  if (redeemUnavailable && !nfts?.length) {
    return null
  }

  return (
    <div className="relative">
      <div
        className={twMerge(
          'flex flex-col overflow-hidden rounded-lg border border-grey-200 bg-grey-50 px-4 py-3 text-sm text-grey-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200',
          className,
        )}
      >
        <label className="mb-2 font-normal">{label}</label>
        {!redeemUnavailable && (
          <div className="space-y-2">
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
              <TokenBadge
                token={token.ticker}
                image={token.image}
                isErc20={
                  token.type !== 'eth' ? token.type === 'erc20' : undefined
                }
              />
            </div>
            <div className="flex min-h-[22px] justify-between">
              <span>
                {convertedValue && formatCurrencyAmount(convertedValue)}
              </span>
              <span>
                {token.balance && <>Balance: {formatAmount(token.balance)}</>}
              </span>
            </div>
          </div>
        )}
        {/* Only show spacer if redeem is available and nfts are not empty */}
        {!redeemUnavailable && !!cartNfts?.length && (
          <div className="my-2 h-[1px] w-full border-t border-grey-200 dark:border-slate-600" />
        )}
        {nfts && nfts?.length > 0 && readOnly && (
          <div className="mt-4 space-y-4">
            {nfts?.map((nft, i) => {
              const quantity = cartNfts?.find(cartNft => cartNft.id === nft.id)?.quantity ?? 0
              return <PayRedeemCardNftReward key={i} nft={nft} quantity={quantity} />
            })}
          </div>
        )}
      </div>

      {downArrow && (
        <DownArrow className="absolute -top-1 left-1/2 -translate-y-1/2 -translate-x-1/2" />
      )}
    </div>
  )
}

const TokenBadge = ({
  className,
  token,
  image,
  isErc20,
}: {
  className?: string
  token: string
  image: ReactNode
  isErc20?: boolean
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between gap-2 rounded-full border border-grey-200 bg-white py-1 px-1.5 pr-3 text-base font-medium text-grey-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100',
        className,
      )}
    >
      <Tooltip
        title={
          isErc20 !== undefined
            ? isErc20
              ? t`ERC-20 token`
              : t`This project's tokens are not ERC-20`
            : undefined
        }
      >
        <div className="relative h-8 w-8 rounded-full bg-grey-200">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
            {image}
          </div>
          {isErc20 && (
            <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-white dark:border-slate-700">
              <EthereumLogo />
            </div>
          )}
        </div>
      </Tooltip>
      {token}
    </div>
  )
}

const DownArrow = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'flex h-10 w-10 items-center justify-center bg-grey-50 p-1 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex items-center justify-center rounded-lg border border-grey-200 bg-white p-2 dark:border-slate-600 dark:bg-slate-600">
        <ArrowDownIcon className="h-4 w-4 stroke-2 text-grey-400 dark:text-slate-300" />
      </div>
    </div>
  )
}

export type PayConfigurationProps = {
  userTokenBalance: number | undefined
  projectHasErc20Token: boolean
  payerIssuanceRate: PayerIssuanceRate
}

const PayConfiguration: React.FC<PayConfigurationProps> = ({
  userTokenBalance,
  projectHasErc20Token,
  payerIssuanceRate,
}) => {
  const { payDisabled, message } = usePayProjectDisabled()
  const { tokenSymbol, fundingCycle } = useProjectContext()
  const {
    nftRewards: { rewardTiers, flags: { preventOverspending } },
  } = useContext(NftRewardsContext)

  const chosenNftRewards = useProjectSelector(
    state => state.projectCart.chosenNftRewards,
  )
  const cartPayAmount = useProjectSelector(
    state => state.projectCart.payAmount?.amount,
  )
  const dispatch = useProjectDispatch()
  const store = useProjectStore()
  const wallet = useWallet()
  const { isConnected: walletConnected, connect } = useWallet()
  const { projectId, projectMetadata } = useProjectMetadataContext()

  const [payAmount, setPayAmount] = useState<string>()
  const [fallbackImage, setFallbackImage] = useState<boolean>()

  const tokenLogo = useProjectLogoSrc({
    projectId,
    pv: PV_V2,
    uri: projectMetadata?.logoUri,
  })
  const tokenReceivedAmount = useTokensPerEth({
    amount: payAmount ? parseFloat(payAmount) : cartPayAmount ?? 0,
    currency: V2V3_CURRENCY_ETH,
  })
  const insufficientBalance = useMemo(() => {
    if (!wallet.balance) return false
    const amount = cartPayAmount ?? 0
    const balance = parseFloat(wallet.balance)
    return amount > balance
  }, [cartPayAmount, wallet.balance])

  const tokenTicker = tokenSymbol || 'TOKENS'

  const handleUserPayAmountChange = useCallback(
    (value: string | undefined) => {
      dispatch(
        projectCartActions.addPayment({
          amount: parseFloat(value || '0'),
          currency: V2V3_CURRENCY_ETH,
        }),
      )
      setPayAmount(value)
    },
    [dispatch],
  )

  const payProject = useCallback(() => {
    if (!walletConnected) {
      connect()
      return
    }
    dispatch(projectCartActions.openPayModal())
  }, [connect, dispatch, walletConnected])

  // Update the pay amount input from the cart
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      const payAmount = state.projectCart.payAmount?.amount
      setPayAmount(payAmount?.toString() ?? '')
    })
    return () => {
      unsubscribe()
    }
  }, [store])

  const payButtonDisabled = useMemo(() => {
    if (!walletConnected) return false
    return (
      insufficientBalance ||
      cartPayAmount === 0 ||
      !cartPayAmount ||
      payDisabled ||
      fundingCycle?.number?.isZero()
    )
  }, [
    cartPayAmount,
    insufficientBalance,
    payDisabled,
    walletConnected,
    fundingCycle,
  ])

  return (
    <div>
      {fundingCycle?.number?.isZero() && <FirstCycleCountdownCallout />}

      <div className="relative mt-3">
        <div className="flex flex-col gap-y-2">
          { rewardTiers?.length && preventOverspending ? (
            <PreventOverspendingPayCard />
          ): (
          <>
            <PayRedeemInput
              label={t`You pay`}
              token={{
                balance: wallet.balance,
                image: <EthereumLogo />,
                ticker: 'ETH',
                type: 'eth',
              }}
              value={payAmount ?? cartPayAmount?.toString()}
              onChange={handleUserPayAmountChange}
            />
            <PayRedeemInput
              label={t`You receive`}
              redeemUnavailable={!payerIssuanceRate.enabled}
              downArrow
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
                type: projectHasErc20Token ? 'erc20' : 'native',
              }}
              cartNfts={chosenNftRewards}
              value={
                tokenReceivedAmount.receivedTickets &&
                !!parseFloat(tokenReceivedAmount.receivedTickets)
                  ? tokenReceivedAmount.receivedTickets
                  : ''
              }
            />
          </>
        )}
        </div>
      </div>

      <Tooltip className="w-full flex-1" title={message}>
        <Button
          style={{ display: 'block', width: '100%' }}
          type="primary"
          className="mt-6"
          size="large"
          disabled={payButtonDisabled}
          onClick={payProject}
        >
          {walletConnected ? (
            insufficientBalance ? (
              <Trans>Insufficient balance</Trans>
            ) : (
              <Trans>Pay project</Trans>
            )
          ) : (
            <Trans>Connect wallet</Trans>
          )}
        </Button>
      </Tooltip>
    </div>
  )
}

type RedeemConfigurationProps = {
  userTokenBalance: number | undefined
  projectHasErc20Token: boolean
}

const RedeemConfiguration: React.FC<RedeemConfigurationProps> = ({
  userTokenBalance,
  projectHasErc20Token,
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
    return formatAmount(fromWad(ethReceivedFromTokens))
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
              label={
                <Tooltip
                  title={t`Redeem your tokens for a portion of this project's treasury`}
                >
                  {t`You redeem`}
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

export const PayRedeemCardNftReward: React.FC<{
  nft: NftRewardTier
  quantity: number
  className?: string
}> = ({ nft, className, quantity }) => {
  const {
    price,
    name,
    fileUrl,
    upsertNft,
    removeNft,
    increaseQuantity,
    decreaseQuantity,
  } = useNftCartItem({
    id: nft.id,
    quantity
  } as ProjectCartNftReward)
  const { setProjectPageTab } = useProjectPageQueries()

  const handleRemove = useCallback(() => {
    emitConfirmationDeletionModal({
      onConfirm: removeNft,
      title: t`Remove NFT`,
      description: t`Are you sure you want to remove this NFT?`,
    })
  }, [removeNft])

  const handleIncreaseQuantity = useCallback(() => {
    if (quantity === 0) {
      upsertNft()
    } else {
      increaseQuantity()
    }
  }, [increaseQuantity, quantity, upsertNft])

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity - 1 <= 0) {
      handleRemove()
    } else {
      decreaseQuantity()
    }
  }, [decreaseQuantity, handleRemove, quantity])

  const priceText = useMemo(() => {
    if (price === null) {
      return '-'
    }
    return formatCurrencyAmount(price)
  }, [price])

  return (
    <div
      className={twMerge('flex items-center justify-between gap-3', className)}
    >
      <div className="flex min-w-0 items-center gap-3">
        <SmallNftSquare
          className="h-12 w-12 flex-shrink-0"
          nftReward={{
            fileUrl: fileUrl ?? '',
            name: name ?? '',
          }}
        />
        <div className="flex min-w-0 flex-col">
          <div
            className="flex min-w-0 items-center gap-2"
            role="button"
            onClick={() => setProjectPageTab('nft_rewards')}
          >
            <TruncatedText
              className="min-w-0 max-w-[70%] text-sm font-medium text-grey-900 hover:underline dark:text-slate-100"
              text={name}
            />
            <CartItemBadge>NFT</CartItemBadge>
          </div>

          <div className="text-xs">{priceText}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <QuantityControl
          quantity={quantity}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
        />
        <RemoveIcon onClick={handleRemove} />
      </div>
    </div>
  )
}

const RemoveIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <TrashIcon
    data-testid="cart-item-remove-button"
    role="button"
    className="inline h-6 w-6 text-grey-400 dark:text-slate-300 md:h-4 md:w-4"
    onClick={onClick}
  />
)

const QuantityControl: React.FC<{
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <span className="flex w-fit gap-3 rounded-lg border border-grey-200 p-1 text-sm dark:border-slate-600">
      <button data-testid="cart-item-decrease-button" onClick={onDecrease}>
        <MinusIcon className="h-4 w-4 text-grey-500 dark:text-slate-200" />
      </button>
      {quantity}
      <button data-testid="cart-item-increase-button" onClick={onIncrease}>
        <PlusIcon className="h-4 w-4 text-grey-500 dark:text-slate-200" />
      </button>
    </span>
  )
}
