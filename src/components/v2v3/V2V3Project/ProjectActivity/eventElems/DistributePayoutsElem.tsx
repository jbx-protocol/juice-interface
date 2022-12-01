import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { useV2V3TerminalVersion } from 'hooks/V2V3TerminalVersion'
import { DistributePayoutsEvent } from 'models/subgraph-entities/v2/distribute-payouts-event'
import { classNames } from 'utils/classNames'

export default function DistributePayoutsElem({
  event,
}: {
  event:
    | Pick<
        DistributePayoutsEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'beneficiary'
        | 'beneficiaryDistributionAmount'
        | 'distributedAmount'
        | 'memo'
        | 'terminal'
      >
    | undefined
}) {
  const { data: distributePayoutsEvents } = useSubgraphQuery({
    entity: 'distributeToPayoutSplitEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'amount',
      'beneficiary',
      'splitProjectId',
    ],
    orderDirection: 'desc',
    orderBy: 'amount',
    where: event?.id
      ? {
          key: 'distributePayoutsEvent',
          value: event.id,
        }
      : undefined,
  })

  const terminalVersion = useV2V3TerminalVersion(event?.terminal)

  if (!event) return null

  return (
    <div>
      <div className="flex content-between justify-between">
        <div>
          <div className="text-xs text-grey-400 dark:text-slate-200">
            <Trans>Distributed funds</Trans>
          </div>
          {distributePayoutsEvents?.length ? (
            <div className="text-base">
              <ETHAmount amount={event.distributedAmount} />
            </div>
          ) : null}
        </div>

        <div className="text-right">
          <div className="text-xs text-grey-400 dark:text-slate-200">
            {terminalVersion && (
              <ProjectVersionBadge
                className="p-0"
                transparent
                size="small"
                versionText={'V' + terminalVersion}
              />
            )}{' '}
            {event.timestamp && (
              <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
            )}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div className="text-xs text-grey-400 dark:text-slate-200">
            <Trans>
              called by <FormattedAddress address={event.caller} />
            </Trans>
          </div>
        </div>
      </div>

      <div className="mt-1">
        {distributePayoutsEvents?.map(e => (
          <div
            className="flex items-baseline justify-between text-sm"
            key={e.id}
          >
            <div className="font-medium">
              {e.splitProjectId ? (
                <V2V3ProjectHandleLink projectId={e.splitProjectId} />
              ) : (
                <FormattedAddress address={e.beneficiary} />
              )}
              :
            </div>

            <div className="text-grey-500 dark:text-grey-300">
              <ETHAmount amount={e.amount} />
            </div>
          </div>
        ))}

        {event.beneficiaryDistributionAmount?.gt(0) && (
          <div
            className={classNames(
              'flex items-baseline justify-between',
              distributePayoutsEvents?.length ? 'text-sm' : '',
            )}
          >
            <div className="font-medium">
              <FormattedAddress address={event.beneficiary} />:
            </div>
            <div
              className={
                distributePayoutsEvents?.length
                  ? 'text-grey-500 dark:text-grey-300'
                  : 'font-medium'
              }
            >
              <ETHAmount amount={event.beneficiaryDistributionAmount} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
