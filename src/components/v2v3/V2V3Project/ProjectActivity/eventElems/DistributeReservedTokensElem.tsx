import { Trans } from '@lingui/macro'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { DistributeReservedTokensEvent } from 'models/subgraph-entities/v2/distribute-reserved-tokens-event'
import { useContext } from 'react'
import { classNames } from 'utils/classNames'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function DistributeReservedTokensEventElem({
  event,
}: {
  event:
    | Pick<
        DistributeReservedTokensEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'beneficiary'
        | 'beneficiaryTokenCount'
        | 'tokenCount'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  const { data: distributeEvents } = useSubgraphQuery(
    {
      entity: 'distributeToReservedTokenSplitEvent',
      keys: [
        'id',
        'timestamp',
        'txHash',
        'beneficiary',
        'tokenCount',
        'projectId',
      ],
      orderDirection: 'desc',
      orderBy: 'tokenCount',
      where: event?.id
        ? {
            key: 'distributeReservedTokensEvent',
            value: event.id,
          }
        : undefined,
    },
    {},
  )

  if (!event) return null

  return (
    <div>
      <div className="flex content-between justify-between">
        <div>
          <div className="text-xs text-grey-400 dark:text-slate-200">
            <Trans>
              Distributed reserved{' '}
              {tokenSymbolText({
                tokenSymbol,
                capitalize: false,
                plural: true,
              })}
            </Trans>
          </div>
          {distributeEvents?.length ? (
            <div className="text-base">
              {formatWad(event.tokenCount, { precision: 0 })}{' '}
              {tokenSymbolText({
                tokenSymbol,
                capitalize: false,
                plural: parseInt(fromWad(event.tokenCount) || '0') !== 1,
              })}
            </div>
          ) : null}
        </div>

        <div>
          <div className="text-right text-xs text-grey-400 dark:text-slate-200">
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
        {distributeEvents?.map(e => (
          <div className="flex items-baseline justify-between" key={e.id}>
            <div className="text-sm font-medium">
              <FormattedAddress address={e.beneficiary} />:
            </div>

            <div
              className={classNames(
                distributeEvents.length > 1
                  ? 'text-sm text-grey-500 dark:text-grey-300'
                  : 'font-medium',
              )}
            >
              {formatWad(e.tokenCount, { precision: 0 })}
            </div>
          </div>
        ))}

        {event.beneficiaryTokenCount?.gt(0) && (
          <div className="flex items-baseline justify-between">
            <div className="font-medium">
              <FormattedAddress address={event.beneficiary} />:
            </div>
            <div className="text-grey-500 dark:text-grey-300">
              {formatWad(event.beneficiaryTokenCount, {
                precision: 0,
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
