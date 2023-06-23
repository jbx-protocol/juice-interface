import { Trans, t } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { ProjectAllocationRow } from '../../ProjectAllocationRow/ProjectAllocationRow'
import { reservedTokensTooltip } from '../../TokensPanel/TokensPanelTooltips'
import { DisplayCard } from '../../ui'
import { TitleDescriptionDisplayCard } from '../../ui/TitleDescriptionDisplayCard'
import { useReservedTokensSubPanel } from '../hooks/useReservedTokensSubPanel'
import { ReservedTokensPopupMenu } from './ReservedTokensPopupMenu'
import { SendReservedTokensButton } from './SendReservedTokensButton'

export const ReservedTokensSubPanel = ({
  className,
}: {
  className?: string
}) => {
  const { reservedList, reservedTokens, reservedRate } =
    useReservedTokensSubPanel()

  const reservedRateTooltip = (
    <Trans>
      {reservedRate} of token issuance is set aside for the recipients below.
    </Trans>
  )

  return (
    <div className={twMerge(className)}>
      <h2 className="mb-0 font-heading text-2xl font-medium">
        <Trans>Reserved tokens</Trans>
      </h2>
      <div className="mt-5 flex flex-col items-center gap-4">
        <div className="flex w-full items-center gap-4">
          <TitleDescriptionDisplayCard
            className="w-full"
            title={t`Reserved tokens`}
            description={
              reservedTokens ? (
                <>{reservedTokens}</>
              ) : (
                <div className="h-7 w-24 animate-pulse rounded bg-grey-200 dark:bg-slate-200" />
              )
            }
            tooltip={reservedTokensTooltip}
          />
          <TitleDescriptionDisplayCard
            className="w-full"
            title={t`Reserved rate`}
            description={reservedRate}
            tooltip={reservedRateTooltip}
          />
        </div>
        <DisplayCard className="flex w-full flex-col pb-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="mb-0 whitespace-nowrap font-body text-sm font-medium dark:text-slate-200">
              <Trans>Reserved tokens list</Trans>
            </h3>
            {!!reservedList?.length && <ReservedTokensPopupMenu />}
          </div>

          {reservedList?.length ? (
            <>
              <div className="mt-4 flex w-full flex-col divide-y divide-grey-200 border-b border-grey-200 dark:divide-slate-500 dark:border-slate-500">
                {reservedList
                  ? reservedList.map(props => (
                      <ProjectAllocationRow
                        key={`${props.address}${props.projectId}`}
                        {...props}
                      />
                    ))
                  : null}
              </div>

              <SendReservedTokensButton
                className="z-0 mt-6 w-full justify-center md:w-auto"
                containerClassName="md:self-end"
              />
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
