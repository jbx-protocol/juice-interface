import { CheckOutlined, LoadingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Skeleton, Tooltip } from 'antd'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { NftRewardTier } from 'models/nftRewardTier'
import { MouseEventHandler, useContext, useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { classNames } from 'utils/classNames'
import { ipfsToHttps } from 'utils/ipfs'
import { payMetadataOverrides } from 'utils/nftRewards'
import { NftPreview } from './NftPreview'

const MAX_REMAINING_SUPPLY = 10000

// The clickable cards on the project page
export function NftTierCard({
  loading,
  rewardTier,
  rewardTierUpperLimit,
  isSelected,
  onClick,
  onRemove,
  previewDisabled,
  hideAttributes,
}: {
  rewardTier?: NftRewardTier
  rewardTierUpperLimit?: number
  loading?: boolean
  isSelected?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onRemove?: () => void
  previewDisabled?: boolean
  hideAttributes?: boolean
}) {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)

  const { projectId } = useContext(ProjectMetadataContext)

  const imageUrl = rewardTier?.imageUrl
    ? ipfsToHttps(rewardTier.imageUrl)
    : rewardTier?.imageUrl

  const _onRemove = onRemove ?? onClick

  function RewardIcon() {
    return (
      <Tooltip
        title={
          !hideAttributes ? (
            <span className="text-xs">
              {payMetadataOverrides(projectId ?? 0).dontOverspend ? (
                <Trans>
                  Receive this NFT when you contribute{' '}
                  <strong>{rewardTier?.contributionFloor} ETH</strong>.
                </Trans>
              ) : rewardTierUpperLimit ? (
                <Trans>
                  Receive this NFT when you contribute{' '}
                  <strong>{rewardTier?.contributionFloor}</strong> - {'<'}
                  <strong>{rewardTierUpperLimit} ETH</strong>.
                </Trans>
              ) : (
                <Trans>
                  Receive this NFT when you contribute at least{' '}
                  <strong>{rewardTier?.contributionFloor} ETH</strong>.
                </Trans>
              )}
            </span>
          ) : undefined
        }
        overlayInnerStyle={{
          padding: '7px 10px',
          lineHeight: '1rem',
          maxWidth: '210px',
        }}
        placement={'bottom'}
      >
        <div
          className={classNames(
            'absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full text-base',
            isSelected ? 'flex bg-haze-400 text-smoke-25' : 'hidden',
          )}
          onClick={_onRemove ? stopPropagation(_onRemove) : undefined}
        >
          <CheckOutlined />
        </div>
      </Tooltip>
    )
  }

  const remainingSupply =
    rewardTier?.remainingSupply &&
    rewardTier.remainingSupply < MAX_REMAINING_SUPPLY
      ? rewardTier?.remainingSupply
      : t`Unlimited`

  return (
    <>
      <div
        className={classNames(
          'flex h-full w-full cursor-pointer flex-col rounded-sm transition-shadow duration-100',
          isSelected
            ? 'shadow-[2px_0px_10px_0px_var(--boxShadow-primary)] outline outline-2 outline-haze-400'
            : '',
        )}
        onClick={
          !isSelected || previewDisabled
            ? onClick
            : () => {
                setPreviewVisible(true)
              }
        }
        role="button"
      >
        {/* Image container */}
        <div
          className={classNames(
            'relative flex w-full items-center justify-center',
            !loading ? 'pt-[100%]' : 'pt-[unset]',
            isSelected
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
                filter: isSelected ? 'unset' : 'brightness(50%)',
              }}
              crossOrigin="anonymous"
            />
          )}
          {isSelected ? <RewardIcon /> : null}
        </div>
        {/* Details section below image */}
        <div
          className={classNames(
            'flex h-full w-full flex-col justify-center px-3 pb-1.5',
            isSelected
              ? 'bg-smoke-25 dark:bg-slate-800'
              : 'bg-smoke-100 dark:bg-slate-600',
            !loading ? 'pt-2' : 'pt-1',
          )}
          onClick={
            isSelected && _onRemove ? stopPropagation(_onRemove) : undefined
          }
        >
          <Skeleton
            loading={loading}
            active
            title={false}
            paragraph={{ rows: 1, width: ['100%'] }}
          >
            <span
              className={classNames(
                'text-xs',
                'text-ellipsis',
                'overflow-hidden',
                isSelected
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
                  <Trans>{remainingSupply} remaining</Trans>
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
