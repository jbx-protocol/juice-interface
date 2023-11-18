import { t } from '@lingui/macro'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import EthereumAddress from 'components/EthereumAddress'
import MinimalTable from 'components/MinimalTable'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { V1_CURRENCY_ETH } from 'constants/v1/currency'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { ProjectEventsQuery } from 'generated/graphql'
import { useContext } from 'react'
import {
  formatWad,
  perbicentToPercent,
  permilleToPercent,
} from 'utils/format/formatNumber'
import { detailedTimeString } from 'utils/format/formatTime'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'

import { PV_V1 } from 'constants/pv'
import { ActivityEvent } from '../ActivityElement/ActivityElement'

export default function V1ConfigureEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['v1ConfigureEvent']
  withProjectLink?: boolean
}) {
  const { terminal } = useContext(V1ProjectContext)

  if (!event) return null

  function BallotStrategyElem(ballot: string) {
    const strategy = getBallotStrategyByAddress(ballot)
    if (strategy.unknown) return <EthereumAddress address={ballot} />
    else return strategy.name
  }

  return (
    <ActivityEvent
      event={event}
      withProjectLink={withProjectLink}
      pv={PV_V1}
      header={t`Edited cycle`}
      subject={null}
      extra={
        <MinimalTable
          sections={[
            [
              {
                key: t`Duration`,
                value: detailedTimeString({
                  timeSeconds: event.duration * SECONDS_IN_DAY,
                  fullWords: true,
                }),
              },
              {
                key: t`Payouts`,
                value: (
                  <span>
                    <CurrencySymbol
                      currency={
                        event.currency === V1_CURRENCY_ETH ? 'ETH' : 'USD'
                      }
                    />
                    {formatWad(event.target, {
                      precision: event.currency === V1_CURRENCY_ETH ? 4 : 2,
                      padEnd: true,
                    })}
                  </span>
                ),
              },
            ],
            [
              {
                key: t`Reserved rate`,
                value: perbicentToPercent(event.reservedRate) + '%',
              },
              {
                key: t`Redemption rate`,
                value: perbicentToPercent(event.bondingCurveRate) + '%',
              },
              {
                key: t`Issuance reduction rate`,
                value: permilleToPercent(event.discountRate) + '%',
              },
            ],
            [
              {
                key: t`Edit deadline`,
                value: BallotStrategyElem(event.ballot),
              },
            ],
            ...(terminal?.version === '1.1'
              ? [
                  [
                    {
                      key: t`Owner token minting`,
                      value: !!event.ticketPrintingIsAllowed,
                    },
                    {
                      key: t`Payments to this project paused`,
                      value: !!event.payIsPaused,
                    },
                  ],
                ]
              : []),
          ]}
        />
      }
    />
  )
}
