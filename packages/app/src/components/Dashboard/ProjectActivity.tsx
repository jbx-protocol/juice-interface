import { BigNumber } from '@ethersproject/bignumber'
import axios, { AxiosResponse } from 'axios'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import { subgraphUrl } from 'constants/subgraphs'
import { ThemeContext } from 'contexts/themeContext'
import { PayEvent } from 'models/events/pay-event'
import { RedeemEvent } from 'models/events/redeem-event'
import { CSSProperties, useContext, useEffect, useMemo, useState } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { formatGraphQuery } from 'utils/graph'

type DisplayActivity = {
  id: string
  timestamp: number
  element: JSX.Element
}

export default function ProjectActivity({
  projectId,
  tokenSymbol,
}: {
  projectId: BigNumber | undefined
  tokenSymbol: string | undefined
}) {
  const { colors } = useContext(ThemeContext).theme
  const [payEvents, setPayEvents] = useState<PayEvent[]>()
  const [redeemEvents, setRedeemEvents] = useState<RedeemEvent[]>()

  useEffect(() => {
    // Load pay events
    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery<PayEvent>({
            entity: 'payEvent',
            keys: ['amount', 'beneficiary', 'id', 'note', 'timestamp'],
            // TODO aggregate payEvents and redeemEvents into single "projectActivity" query?
            // Currently the last 100 pay events loaded might all be from the last day, while the last 100 redeem events might be spread over several days. can create awkward chronological inconsistency, especially if a "load more" button is implemented
            first: 100,
            orderDirection: 'desc',
            orderBy: 'timestamp',
            where: projectId
              ? {
                  key: 'projectId',
                  value: projectId.toString(),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { payEvents: PayEvent[] } }>) =>
        setPayEvents(res.data?.data?.payEvents),
      )
      .catch(err => console.log('Error getting pay events', err))

    // Load redeem events
    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery<RedeemEvent>({
            entity: 'redeemEvent',
            keys: ['amount', 'beneficiary', 'id', 'returnAmount', 'timestamp'],
            first: 100,
            orderDirection: 'desc',
            orderBy: 'timestamp',
            where: projectId
              ? {
                  key: 'projectId',
                  value: projectId.toString(),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { redeemEvents: RedeemEvent[] } }>) =>
        setRedeemEvents(res.data?.data?.redeemEvents),
      )
      .catch(err => console.log('Error getting redeem events', err))
  }, [projectId])

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    color: colors.text.tertiary,
  }

  const contentLineHeight = 1.5

  const formatPayEvent = (e: PayEvent): DisplayActivity => ({
    timestamp: BigNumber.from(e.timestamp).toNumber(),
    id: e.id,
    element: (
      <div
        style={{
          marginBottom: 20,
          paddingBottom: 20,
          borderBottom: '1px solid ' + colors.stroke.tertiary,
        }}
        key={e.id}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignContent: 'space-between',
          }}
        >
          <div>
            <div style={smallHeaderStyle}>Paid</div>
            <div
              style={{
                lineHeight: contentLineHeight,
                fontSize: '1rem',
                marginRight: 10,
                color: colors.text.primary,
              }}
            >
              <CurrencySymbol currency={0} />
              {formatWad(e.amount)}
            </div>
          </div>

          <div>
            <div
              style={{
                ...smallHeaderStyle,
                textAlign: 'right',
                color: colors.text.secondary,
              }}
            >
              {formatDate(BigNumber.from(e.timestamp).mul(1000))}
            </div>
            <div
              style={{
                ...smallHeaderStyle,
                color: colors.text.secondary,
                marginTop: '.3rem',
                lineHeight: contentLineHeight,
                textAlign: 'right',
              }}
            >
              <FormattedAddress address={e.beneficiary} shortened={false} />
            </div>
          </div>
        </div>

        {e.note && (
          <div style={{ color: colors.text.secondary, marginTop: 5 }}>
            "{e.note}"
          </div>
        )}
      </div>
    ),
  })

  const formatRedeemEvent = (e: RedeemEvent): DisplayActivity => ({
    timestamp: BigNumber.from(e.timestamp).toNumber(),
    id: e.id,
    element: (
      <div
        style={{
          marginBottom: 20,
          paddingBottom: 20,
          borderBottom: '1px solid ' + colors.stroke.tertiary,
        }}
        key={e.id}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignContent: 'space-between',
          }}
        >
          <div>
            <div style={smallHeaderStyle}>Redeemed</div>
            <div
              style={{
                lineHeight: contentLineHeight,
                fontSize: '1rem',
                marginRight: 10,
                color: colors.text.primary,
              }}
            >
              {formatWad(e.amount)} {tokenSymbol ?? 'tokens'}
            </div>
          </div>

          <div>
            <div
              style={{
                ...smallHeaderStyle,
                textAlign: 'right',
                color: colors.text.secondary,
              }}
            >
              {formatDate(BigNumber.from(e.timestamp).mul(1000))}
            </div>
            <div
              style={{
                ...smallHeaderStyle,
                color: colors.text.secondary,
                marginTop: '.3rem',
                lineHeight: contentLineHeight,
                textAlign: 'right',
              }}
            >
              <FormattedAddress address={e.beneficiary} shortened={false} />
            </div>
          </div>
        </div>

        <div
          style={{
            ...smallHeaderStyle,
            color: colors.text.secondary,
            marginTop: 5,
          }}
        >
          <CurrencySymbol currency={0} />
          {formatWad(e.returnAmount)} overflow received
        </div>
      </div>
    ),
  })

  const sortedActivity: DisplayActivity[] = useMemo(
    () =>
      [
        ...(payEvents?.map(formatPayEvent) ?? []),
        ...(redeemEvents?.map(formatRedeemEvent) ?? []),
      ].sort((a, b) =>
        BigNumber.from(a.timestamp).lt(BigNumber.from(b.timestamp)) ? 1 : -1,
      ),
    [payEvents, redeemEvents],
  )

  return (
    <div>
      {sortedActivity?.length ? (
        sortedActivity.map(item => <div key={item.id}>{item.element}</div>)
      ) : (
        <div
          style={{
            color: colors.text.secondary,
            paddingTop: 20,
            borderTop: '1px solid ' + colors.stroke.tertiary,
          }}
        >
          No activity yet
        </div>
      )}
    </div>
  )
}
