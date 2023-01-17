import { LoadingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import { NftRewardTier } from 'models/nftRewardTier'
import { useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { classNames } from 'utils/classNames'
import { ipfsToHttps } from 'utils/ipfs'
import { NftPreview } from './NftPreview'
import { QuantitySelector } from './QuantitySelector'

const MAX_REMAINING_SUPPLY = 10000

// The clickable cards on the project page
export function NftTierCard({
  loading,
  rewardTier,
  isSelected,
  quantitySelected = 0,
  maxQuantity,
  onSelect,
  onDeselect,
  previewDisabled,
  hideAttributes,
}: {
  rewardTier?: NftRewardTier
  loading?: boolean
  isSelected?: boolean
  quantitySelected?: number
  maxQuantity?: number
  onSelect: (quantity?: number) => void
  onDeselect: (quantity?: number) => void
  previewDisabled?: boolean
  hideAttributes?: boolean
}) {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)

  // used to return to previous state on second click if user accidentally unselected the NFT
  const [previousQuantity, setPreviousQuantity] = useState<number>(1)

  const imageUrl = rewardTier?.imageUrl
    ? ipfsToHttps(rewardTier.imageUrl)
    : rewardTier?.imageUrl

  const hasQuantitySelected = quantitySelected > 0
  const _isSelected = isSelected || hasQuantitySelected

  const showQuantitySelector = Boolean(
    maxQuantity && maxQuantity > 1 && hasQuantitySelected,
  )

  // When previewDisabled, we want card to deselect when clicked while it is selected.
  const onClickNoPreview = _isSelected ? onDeselect : onSelect

  const openPreview = () => {
    setPreviewVisible(true)
  }

  const remainingSupply =
    rewardTier?.remainingSupply &&
    rewardTier.remainingSupply < MAX_REMAINING_SUPPLY
      ? t`${rewardTier?.remainingSupply} remaining`
      : t`Unlimited`

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
          'flex h-full w-full cursor-pointer select-none flex-col rounded-sm transition-shadow duration-100',
          _isSelected
            ? 'shadow-[2px_0px_10px_0px_var(--boxShadow-primary)] outline outline-2 outline-haze-400'
            : '',
        )}
        onClick={
          _isSelected && !previewDisabled
            ? openPreview
            : () => onClickNoPreview()
        }
        role="button"
      >
        {/* Image container */}
        <div
          className={classNames(
            'relative flex w-full items-center justify-center',
            !loading ? 'pt-[100%]' : 'pt-[unset]',
            _isSelected
              ? 'bg-smoke-25 dark:bg-slate-800'
              : 'bg-smoke-100 dark:bg-slate-600',
          )}
        >
          {loading ? (
            <div className="flex h-[151px] w-full items-center justify-center border border-solid border-smoke-200 dark:border-grey-600">
              <LoadingOutlined />
            </div>
          ) : (
            <img
              className={classNames(
                'absolute top-0 h-full w-full object-cover',
              )}
              alt={rewardTier?.name}
              src={imageUrl}
              style={{
                filter: _isSelected ? 'unset' : 'brightness(50%)',
              }}
              crossOrigin="anonymous"
            />
          )}
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
            'flex h-full w-full flex-col justify-center px-3 pb-1.5',
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
              <Skeleton
                className="mt-1"
                loading={loading}
                active
                title={false}
                paragraph={{ rows: 1, width: ['50%'] }}
              >
                <span className="text-sm text-grey-900 dark:text-slate-50">
                  {rewardTier?.contributionFloor} ETH
                </span>
              </Skeleton>
              <Skeleton
                className="pt-5"
                loading={loading}
                active
                title={false}
                paragraph={{ rows: 1, width: ['50%'] }}
              >
                <span className="mt-2 text-xs text-grey-500 dark:text-slate-200">
                  <Trans>{remainingSupply}</Trans>
                </span>
              </Skeleton>
            </>
          ) : null}
        </div>
      </div>
      {rewardTier && !previewDisabled ? (
        <NftPreview
          open={previewVisible}
          rewardTier={rewardTier}
          onClose={() => setPreviewVisible(false)}
          imageUrl={imageUrl}
        />
      ) : null}
    </>
  )
}
