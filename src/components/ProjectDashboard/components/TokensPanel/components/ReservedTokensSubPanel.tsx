import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { ProjectAllocationRow } from '../../ProjectAllocationRow/ProjectAllocationRow'
import { DisplayCard } from '../../ui'
import { useReservedTokensSubPanel } from '../hooks/useReservedTokensSubPanel'
import { SendReservedTokensButton } from './SendReservedTokensButton'

export const ReservedTokensSubPanel = ({
  className,
}: {
  className?: string
}) => {
  const { reservedList, reservedTokens, reservedRate } =
    useReservedTokensSubPanel()
  return (
    <div className={twMerge(className)}>
      <h2 className="mb-0 font-heading text-2xl font-medium">
        <Trans>Reserved tokens</Trans>
      </h2>
      <div className="mt-5 flex flex-col items-center gap-4">
        <div className="flex w-full items-center gap-4">
          <DisplayCard className="flex w-full flex-col gap-2">
            <h3 className="text-grey-60 font-body0 mb-0 whitespace-nowrap text-sm font-medium dark:text-slate-200">
              <Trans>Reserved tokens</Trans>
            </h3>
            {reservedTokens !== undefined ? (
              <span className="font-heading text-xl font-medium">
                {reservedTokens}
              </span>
            ) : (
              <div>
                <div className="h-7 w-24 animate-pulse rounded bg-grey-200 dark:bg-slate-200" />
              </div>
            )}
          </DisplayCard>
          <DisplayCard className="flex w-full flex-col gap-2">
            <h3 className="text-grey-60 font-body0 mb-0 whitespace-nowrap text-sm font-medium dark:text-slate-200">
              <Trans>Reserved rate</Trans>
            </h3>
            <span className="font-heading text-xl font-medium">
              {reservedRate}
            </span>
          </DisplayCard>
        </div>
        <DisplayCard className="flex w-full flex-col pb-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="mb-0 whitespace-nowrap font-body text-sm font-medium dark:text-slate-200">
              <Trans>Reserved tokens list</Trans>
            </h3>
            {!!reservedList?.length && (
              <EllipsisVerticalIcon role="button" className="h-6 w-6" />
            )}
          </div>

          {reservedList?.length ? (
            <>
              <div className="mt-4 flex w-full flex-col divide-y divide-grey-200 border-b border-grey-200 dark:divide-slate-500 dark:border-slate-500">
                {reservedList
                  ? reservedList.map(props => (
                      <ProjectAllocationRow key={props.address} {...props} />
                    ))
                  : null}
              </div>

              <SendReservedTokensButton className="mt-6 self-end" />
            </>
          ) : (
            <div className="mt-5">
              <Trans>
                No distributable reserved tokens have been configured for this
                project.
              </Trans>
            </div>
          )}
        </DisplayCard>
      </div>
    </div>
  )
}
