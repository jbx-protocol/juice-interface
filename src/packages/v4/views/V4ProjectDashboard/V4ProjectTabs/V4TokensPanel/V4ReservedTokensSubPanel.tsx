import { Trans, t } from '@lingui/macro'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { reservedTokensTooltip } from 'components/Project/ProjectTabs/TokensPanelTooltips'
import { twMerge } from 'tailwind-merge'
import { V4ProjectAllocationRow } from '../V4CyclesPayoutsPanel/V4ProjectAllocationRow'
import { useV4ReservedTokensSubPanel } from './hooks/useV4ReservedTokensSubPanel'
import { V4ExportReservedTokensCsvItem } from './V4ExportReservedTokensCsvItem'
import { V4SendReservedTokensButton } from './V4SendReservedTokensButton'

export const V4ReservedTokensSubPanel = ({
  className,
}: {
  className?: string
}) => {
  const { reservedList, totalCreditSupply, reservedPercent } =
    useV4ReservedTokensSubPanel()

  const reservedPercentTooltip = (
    <Trans>
      {reservedPercent} of token issuance is set aside for the recipients below.
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
              totalCreditSupply ? (
                <>{totalCreditSupply}</>
              ) : (
                <div className="h-7 w-24 animate-pulse rounded bg-grey-200 dark:bg-slate-200" />
              )
            }
            tooltip={reservedTokensTooltip}
          />
          <TitleDescriptionDisplayCard
            className="w-full min-w-min flex-[1_0_0]"
            title={t`Reserved rate`}
            description={reservedPercent}
            tooltip={reservedPercentTooltip}
          />
        </div>
        {reservedPercent &&
        totalCreditSupply &&
        reservedPercent !== '0' ? (
          <TitleDescriptionDisplayCard
            className="w-full"
            title={t`Reserved tokens list`}
            kebabMenu={{
              items: kebabMenuItems,
            }}
          >
            {totalCreditSupply ||
            reservedPercent ||
            (reservedList && reservedList.length > 1) ? (
              <>
                <div className="mt-4 flex w-full flex-col divide-y divide-grey-200 border-b border-grey-200 dark:divide-slate-500 dark:border-slate-500">
                  {reservedList
                    ? reservedList.map(props => (
                        <V4ProjectAllocationRow
                          key={`${props.address}${props.projectId}`}
                          {...props}
                        />
                      ))
                    : null}
                </div>

                <V4SendReservedTokensButton
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
    component: <V4ExportReservedTokensCsvItem />,
  },
]
