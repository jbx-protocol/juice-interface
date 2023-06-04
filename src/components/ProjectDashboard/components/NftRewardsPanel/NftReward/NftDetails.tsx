import { Skeleton } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import { NftRewardTier } from 'models/nftRewards'
import { classNames } from 'utils/classNames'
import { parseWad } from 'utils/format/formatNumber'

export function NftDetails({
  rewardTier,
  loading,
  hideAttributes,
  remainingSupplyText,
}: {
  rewardTier: NftRewardTier | undefined
  loading: boolean | undefined
  hideAttributes?: boolean
  remainingSupplyText: string
}) {
  return (
    <div
      className={classNames(
        'flex h-full w-full flex-col justify-between rounded-b-lg bg-white pr-3.5 pl-3 pb-2.5',
        !loading ? 'pt-3.5' : 'pt-1',
      )}
    >
      <Skeleton
        loading={loading}
        active
        title={false}
        paragraph={{ rows: 1, width: ['100%'] }}
      >
        <span
          className={classNames(
            'text-base font-medium',
            'text-ellipsis',
            'overflow-hidden',
            'text-black dark:text-slate-100',
          )}
        >
          {rewardTier?.name}
        </span>
      </Skeleton>
      {!hideAttributes ? (
        <div className="mt-2 flex items-center justify-between">
          {rewardTier?.contributionFloor ? (
            <Skeleton
              className="mt-1"
              loading={loading}
              active
              title={false}
              paragraph={{ rows: 1, width: ['50%'] }}
            >
              <span className="text-lg font-medium text-grey-900 dark:text-slate-50">
                <ETHAmount amount={parseWad(rewardTier.contributionFloor)} />
              </span>
            </Skeleton>
          ) : null}
          <Skeleton
            className="pt-5 text-right"
            loading={loading}
            active
            title={false}
            paragraph={{ rows: 1, width: ['50%'] }}
          >
            <span className="text-xs text-grey-400 dark:text-slate-200">
              {remainingSupplyText}
            </span>
          </Skeleton>
        </div>
      ) : null}
    </div>
  )
}
