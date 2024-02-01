import { t } from '@lingui/macro'
import { Skeleton } from 'antd'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import ETHAmount from 'components/currency/ETHAmount'
import { DEFAULT_NFT_MAX_SUPPLY } from 'constants/nftRewards'
import { NftRewardTier } from 'models/nftRewards'
import { useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { twMerge } from 'tailwind-merge'
import { classNames } from 'utils/classNames'
import { parseWad } from 'utils/format/formatNumber'
import { pinataToGatewayUrl } from 'utils/ipfs'
import { QuantitySelector } from './QuantitySelector'

// The clickable cards on the project page
export function NftTierCard({
  loading,
  rewardTier,
  isSelected,
  quantitySelected = 0,
  maxQuantity,
  onSelect,
  onDeselect,
  hideAttributes,
}: {
  rewardTier?: NftRewardTier
  loading?: boolean
  isSelected?: boolean
  quantitySelected?: number
  maxQuantity?: number
  onSelect: (quantity?: number) => void
  onDeselect: (quantity?: number) => void
  hideAttributes?: boolean
}) {
  // used to return to previous state on second click if user accidentally unselected the NFT
  const [previousQuantity, setPreviousQuantity] = useState<number>(1)

  const fileUrl = rewardTier?.fileUrl
    ? pinataToGatewayUrl(rewardTier.fileUrl)
    : undefined

  const hasQuantitySelected = quantitySelected > 0
  const _isSelected = isSelected || hasQuantitySelected

  const showQuantitySelector = Boolean(
    maxQuantity && maxQuantity > 1 && hasQuantitySelected,
  )

  const toggleSelected = _isSelected ? onDeselect : onSelect

  const remainingSupply = rewardTier?.remainingSupply
  const hasRemainingSupply = remainingSupply && remainingSupply > 0
  const remainingSupplyText = !hasRemainingSupply
    ? t`SOLD OUT`
    : rewardTier.maxSupply === DEFAULT_NFT_MAX_SUPPLY
    ? t`Unlimited`
    : t`${rewardTier?.remainingSupply} remaining`

  const handleBottomSectionClick = () => {
    if (_isSelected) {
      // return to previous state on second click if user accidentally unselected the NFT
      setPreviousQuantity(quantitySelected)
      onDeselect()
    } else {
      onSelect(previousQuantity)
    }
  }

  return (
    <>
      <div
        className={classNames(
          'flex h-full w-full cursor-pointer select-none flex-col rounded-lg shadow-smoke-300 outline-2 outline-bluebs-500 transition-shadow duration-100 hover:shadow-md dark:shadow-grey-900',
          _isSelected ? 'shadow-md outline' : '',
        )}
        onClick={() => toggleSelected()}
        role="button"
      >
        {/* Image/video container */}
        <div
          className={twMerge(
            `relative flex h-36 w-full items-center justify-center rounded-t-lg`,
            _isSelected
              ? 'bg-smoke-25 dark:bg-slate-800'
              : 'bg-smoke-100 dark:bg-slate-600',
          )}
        >
          {fileUrl ? (
            <JuiceVideoThumbnailOrImage
              src={fileUrl}
              alt={rewardTier?.name ?? 'Juicebox NFT reward'}
              className="h-36 w-full rounded-b-none rounded-t-lg"
            />
          ) : null}
          {showQuantitySelector ? (
            <QuantitySelector
              value={quantitySelected}
              maxValue={maxQuantity}
              onIncrement={onSelect}
              onDecrement={() => {
                // Nitpick edge case:
                //   - previousQuantity is set but user removes selection with quantitySelector
                if (quantitySelected === 1) {
                  setPreviousQuantity(1)
                }
                onDeselect(1)
              }}
            />
          ) : null}
        </div>
        {/* Details section below image */}
        <div
          className={classNames(
            'flex h-full w-full flex-col justify-center rounded-b-lg px-3 pb-1.5',
            _isSelected
              ? 'bg-smoke-25 dark:bg-slate-800'
              : 'bg-smoke-100 dark:bg-slate-600',
            !loading ? 'pt-2' : 'pt-1',
          )}
          onClick={stopPropagation(handleBottomSectionClick)}
        >
          <Skeleton
            loading={loading}
            active
            title={false}
            paragraph={{ rows: 1, width: ['100%'] }}
          >
            <span
              className={classNames(
                'text-xs font-medium',
                'text-ellipsis',
                'overflow-hidden',
                _isSelected
                  ? 'text-black dark:text-slate-100'
                  : 'text-grey-600 dark:text-slate-100',
              )}
            >
              {rewardTier?.name}
            </span>
          </Skeleton>
          {!hideAttributes ? (
            <>
              {rewardTier?.contributionFloor ? (
                <Skeleton
                  className="mt-1"
                  loading={loading}
                  active
                  title={false}
                  paragraph={{ rows: 1, width: ['50%'] }}
                >
                  <span className="text-sm text-grey-900 dark:text-slate-50">
                    <ETHAmount
                      amount={parseWad(rewardTier.contributionFloor)}
                    />
                  </span>
                </Skeleton>
              ) : null}
              <Skeleton
                className="pt-5"
                loading={loading}
                active
                title={false}
                paragraph={{ rows: 1, width: ['50%'] }}
              >
                <span className="mt-2 text-xs text-grey-500 dark:text-slate-200">
                  {remainingSupplyText}
                </span>
              </Skeleton>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
