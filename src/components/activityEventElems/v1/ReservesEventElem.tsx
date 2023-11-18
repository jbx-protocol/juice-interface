import { Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { PV_V1 } from 'constants/pv'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import {
  ProjectEventsQuery,
  useTicketModDistributionsForPrintReservesEventQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { useContext } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { ActivityEvent } from '../ActivityElement/ActivityElement'

export default function ReservesEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['printReservesEvent']
  withProjectLink?: boolean
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  // Load individual DistributeToTicketMod events, emitted by internal transactions of the PrintReserves transaction
  const { data } = useTicketModDistributionsForPrintReservesEventQuery({
    client,
    variables: {
      printReservesEvent: event?.id,
    },
  })

  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      withProjectLink={withProjectLink}
      pv={PV_V1}
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
        <div className="text-base font-medium text-grey-900 dark:text-slate-100">
          {formatWad(event.count, { precision: 0 })}{' '}
          {tokenSymbolText({
            tokenSymbol,
            capitalize: false,
            plural: parseInt(fromWad(event.count) || '0') !== 1,
          })}
        </div>
      }
      extra={
        <div>
          {data?.distributeToTicketModEvents.map(e => (
            <div
              key={e.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
              className="text-sm"
            >
              <div>
                <EthereumAddress
                  className="text-grey-900 dark:text-slate-100"
                  address={e.modBeneficiary}
                />
                :
              </div>
              <div className="text-grey-500 dark:text-grey-300">
                {formatWad(e.modCut, { precision: 0 })}{' '}
                {tokenSymbolText({
                  tokenSymbol,
                  capitalize: false,
                  plural: true,
                })}
              </div>
            </div>
          ))}

          {event.beneficiaryTicketAmount?.gt(0) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
              className="text-sm"
            >
              <div>
                <EthereumAddress
                  className="text-grey-900 dark:text-slate-100"
                  address={event.beneficiary}
                />
                :
              </div>
              <div className="text-grey-500 dark:text-grey-300">
                {formatWad(event.beneficiaryTicketAmount, {
                  precision: 0,
                })}{' '}
                {tokenSymbolText({
                  tokenSymbol,
                  capitalize: false,
                  plural: true,
                })}
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}
