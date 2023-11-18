import { Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { PV_V2 } from 'constants/pv'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import {
  ProjectEventsQuery,
  useSplitDistributionsForDistributeReservedTokensEventQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { useContext } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { ActivityEvent } from '../ActivityElement/ActivityElement'

export default function DistributeReservedTokensEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['distributeReservedTokensEvent']
  withProjectLink?: boolean
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  // Load individual DistributeToReservedTokenSplit events, emitted by internal transactions of the DistributeReservedTokens transaction
  const { data } = useSplitDistributionsForDistributeReservedTokensEventQuery({
    client,
    variables: {
      distributeReservedTokensEvent: event?.id,
    },
  })

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
        <div className="font-heading text-lg">
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
          {data?.distributeToReservedTokenSplitEvents.map(e => (
            <div key={e.id} className="flex items-baseline justify-between">
              <div>
                {e.splitProjectId ? (
                  <V2V3ProjectHandleLink projectId={e.splitProjectId} />
                ) : (
                  <JuiceboxAccountLink
                    className="text-grey-900 dark:text-slate-100"
                    address={e.beneficiary}
                  />
                )}
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
