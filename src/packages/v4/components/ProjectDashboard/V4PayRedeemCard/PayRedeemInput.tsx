import { ModalStep, useModal } from '@getpara/react-sdk'
import {
  ArrowDownIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import React, { ReactNode, useCallback, useMemo } from 'react'

import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import { SmallNftSquare } from 'components/NftRewards/SmallNftSquare'
import { TruncatedText } from 'components/TruncatedText'
import { CURRENCY_METADATA } from 'constants/currency'
import { emitConfirmationDeletionModal } from 'hooks/emitConfirmationDeletionModal'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useWallet } from 'hooks/Wallet'
import { NftRewardTier } from 'models/nftRewards'
import { useV4NftRewards } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import { useV4UserNftCredits } from 'packages/v4/contexts/V4UserNftCreditsProvider'
import { useNftCartItem } from 'packages/v4/hooks/useNftCartItem'
import { V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { formatCurrencyAmount } from 'packages/v4/utils/formatCurrencyAmount'
import { useProjectPageQueries } from 'packages/v4/views/V4ProjectDashboard/hooks/useProjectPageQueries'
import { twMerge } from 'tailwind-merge'
import { formatAmount } from 'utils/format/formatAmount'
import { ProjectCartNftReward } from '../ReduxProjectCartProvider'
import { EthereumLogo } from './EthereumLogo'
import { usePayAmounts } from './PayProjectModal/hooks/usePayAmounts'

const MAX_AMOUNT = BigInt(Number.MAX_SAFE_INTEGER)

export const PayRedeemInput = ({
  className,
  label,
  downArrow,
  readOnly,
  redeemUnavailable,
  token,
  cartNfts,
  value,
  onChange,
  actionType,
  cardType,
}: {
  actionType?: 'pay' | 'redeem'
  cardType?: 'input' | 'receive'
  className?: string
  label?: React.ReactNode
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
  token.type = token.type || 'native'
  const {
    nftRewards: { rewardTiers: nfts },
  } = useV4NftRewards()
  const { openModal } = useModal();
  const { userAddress } = useWallet()

  const converter = useCurrencyConverter()

  const convertedValue = useMemo(() => {
    if (!value || token.type !== 'eth') {
      return undefined
    }

    const usdPerEth = converter.usdPerEth
    const n = parseFloat(value)
    if (Number.isNaN(n)) {
      return undefined
    }

    const amount = usdPerEth ? n * usdPerEth : undefined
    return {
      amount,
      currency: V4_CURRENCY_USD,
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

  const showGetEth = actionType === 'pay' && token.balance === '0' && userAddress;
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
              <div>
                <span>
                  {convertedValue ? formatCurrencyAmount(convertedValue) : null}
                </span>
                {cardType === 'input' ? <NftCreditsDisplay />: null}
              </div>
              <div className="flex flex-col items-end">
                <span>
                  {token.balance && <>Balance: {formatAmount(token.balance)}</>}
                </span>
                {showGetEth && (
                  <button
                    type="button"
                    className="hover:text-grey-700 dark:text-grey-300 underline underline-offset-2 text-xs mt-1 cursor-pointer dark:hover:text-grey-400"
                    onClick={() => openModal({ step: ModalStep.ADD_FUNDS_BUY })}
                  >
                    Get ETH
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Only show spacer if redeem is available and nfts are not empty */}
        {!redeemUnavailable && !!cartNfts?.length && (
          <div className="my-2 h-[1px] w-full border-t border-grey-200 dark:border-slate-600" />
        )}

        {nfts && nfts?.length > 0 && readOnly && actionType === 'pay' && (
          <div className="mt-4 space-y-4">
            {nfts.map((nft, i) => {
              const quantity =
                cartNfts?.find(cartNft => cartNft.id === nft.id)?.quantity ?? 0
              return (
                <PayRedeemCardNftReward key={i} nft={nft} quantity={quantity} />
              )
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
              : t`This project's tokens are not yet ERC-20`
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
    quantity,
  } as ProjectCartNftReward)
  const { setProjectPageTab } = useProjectPageQueries()

  const handleRemove = React.useCallback(() => {
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

  const handleDecreaseQuantity = React.useCallback(() => {
    if (quantity - 1 <= 0) {
      handleRemove()
    } else {
      decreaseQuantity()
    }
  }, [decreaseQuantity, handleRemove, quantity])

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
              className="min-w-0 text-sm font-medium text-grey-900 hover:underline dark:text-slate-100"
              text={name}
            />
          </div>

          <div className="text-xs">
            <CurrencySymbol currency={CURRENCY_METADATA.ETH.name} />{' '}
            {nft.contributionFloor}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <QuantityControl
          quantity={quantity}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
        />
      </div>
    </div>
  )
}

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

const NftCreditsDisplay = () => {
  const { data: nftCredits } = useV4UserNftCredits()
  const { formattedNftCredits } = usePayAmounts()

  if (!nftCredits || nftCredits <= 0n || !formattedNftCredits?.primaryAmount) return null

  return (
    <div className="text-xs text-grey-600 dark:text-slate-200 pb-1">
      <strong>{t`${formattedNftCredits.primaryAmount} NFT credits will apply`}</strong>
    </div>
  )
}
