import { Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { ProjectEventsQuery } from 'generated/graphql'
import useSubgraphQuery from 'hooks/useSubgraphQuery'
import { useContext } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { PV_V2 } from 'constants/pv'
import { ActivityEvent } from '../ActivityElement'

export default function DistributeReservedTokensEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['distributeReservedTokensEvent']
  withProjectLink?: boolean
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  // Load individual DistributeToReservedTokenSplit events, emitted by internal transactions of the DistributeReservedTokens transaction
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
    <ActivityEvent
      event={event}
      withProjectLink={withProjectLink}
      pv={PV_V2}
      header={
        <Trans>
          Sent reserved{' '}
          {tokenSymbolText({
            tokenSymbol,
            capitalize: false,
            plural: true,
          })}
        </Trans>
      }
      subject={
        <div className="text-base font-medium">
          {formatWad(event.tokenCount, { precision: 0 })}{' '}
          {tokenSymbolText({
            tokenSymbol,
            capitalize: false,
            plural: parseInt(fromWad(event.tokenCount) || '0') !== 1,
          })}
        </div>
      }
      extra={
        <div>
          {distributeEvents?.map(e => (
            <div key={e.id} className="flex items-baseline justify-between">
              <div>
                <EthereumAddress
                  className="text-grey-900 dark:text-slate-100"
                  address={e.beneficiary}
                />
                :
              </div>

              <div className="text-sm text-grey-500 dark:text-grey-300">
                {formatWad(e.tokenCount, { precision: 0 })}{' '}
                {tokenSymbolText({
                  tokenSymbol,
                  capitalize: false,
                  plural: true,
                })}
              </div>
            </div>
          ))}

          {event.beneficiaryTokenCount?.gt(0) && (
            <div className="flex items-baseline justify-between">
              <div>
                <EthereumAddress
                  className="text-grey-900 dark:text-slate-100"
                  address={event.beneficiary}
                />
                :
              </div>
              <div className="text-sm text-grey-500 dark:text-grey-300">
                {formatWad(event.beneficiaryTokenCount, {
                  precision: 0,
                })}
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}
