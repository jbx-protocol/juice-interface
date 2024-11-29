import { Skeleton } from 'antd'
import { TruncatedText } from 'components/TruncatedText'
import ETHAmount from 'components/currency/ETHAmount'
import { NftRewardTier } from 'models/nftRewards'
import { twMerge } from 'tailwind-merge'
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
      className={twMerge(
        'flex w-full flex-col justify-between rounded-b-lg bg-white p-4 dark:bg-slate-700 md:h-full',
        !loading ? 'pt-4' : 'pt-1',
      )}
    >
      <Skeleton
        loading={loading}
        active
        title={false}
        paragraph={{ rows: 1, width: ['100%'] }}
      >
        <TruncatedText
          className="text-sm font-medium text-black dark:text-slate-50 md:text-base"
          text={rewardTier?.name ?? ''}
        />
      </Skeleton>
      {!hideAttributes ? (
        <div className="mt-1 flex flex-col justify-between gap-1.5 md:mt-3 md:flex-row md:items-center">
          {rewardTier?.contributionFloor ? (
            <Skeleton
              className="mt-1"
              loading={loading}
              active
              title={false}
              paragraph={{ rows: 1, width: ['50%'] }}
            >
              <span className="text-base font-medium text-grey-900 dark:text-slate-100 md:text-lg">
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
            <span className="text-xs text-grey-400 dark:text-slate-300">
              {remainingSupplyText}
            </span>
          </Skeleton>
        </div>
      ) : null}
    </div>
  )
}
