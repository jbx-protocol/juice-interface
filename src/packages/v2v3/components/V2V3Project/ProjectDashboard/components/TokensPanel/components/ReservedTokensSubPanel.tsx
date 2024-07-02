import { Trans, t } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { ProjectAllocationRow } from '../../ProjectAllocationRow/ProjectAllocationRow'
import { TitleDescriptionDisplayCard } from '../../ui/TitleDescriptionDisplayCard'
import { reservedTokensTooltip } from '../TokensPanelTooltips'
import { useReservedTokensSubPanel } from '../hooks/useReservedTokensSubPanel'
import { ExportTokensCsvItem } from './ExportTokensCsvItem'
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
        <div className="flex w-full flex-wrap items-center gap-4">
          <TitleDescriptionDisplayCard
            className="w-full min-w-min flex-[1_0_0]"
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
            className="w-full min-w-min flex-[1_0_0]"
            title={t`Reserved rate`}
            description={reservedRate}
            tooltip={reservedRateTooltip}
          />
        </div>
        {reservedRate &&
        reservedTokens &&
        reservedTokens !== '0' &&
        reservedRate !== '0' ? (
          <TitleDescriptionDisplayCard
            className="w-full"
            title={t`Reserved tokens list`}
            kebabMenu={{
              items: kebabMenuItems,
            }}
          >
            {reservedTokens ||
            reservedRate ||
            (reservedList && reservedList.length > 1) ? (
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
                  className="z-0 w-full justify-center md:w-auto"
                  containerClassName="md:self-end mt-6 inline-flex"
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
          </TitleDescriptionDisplayCard>
        ) : null}
      </div>
    </div>
  )
}

const kebabMenuItems = [
  {
    id: 'export',
    component: <ExportTokensCsvItem />,
  },
]
