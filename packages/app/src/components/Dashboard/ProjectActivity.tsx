import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import Autolinker from 'autolinker'
import axios, { AxiosResponse } from 'axios'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import Loading from 'components/shared/Loading'
import { subgraphUrl } from 'constants/subgraphs'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumberish } from 'ethers'
import { PayEvent } from 'models/events/pay-event'
import { RedeemEvent } from 'models/events/redeem-event'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { formatGraphQuery } from 'utils/graph'

import RichImgPreview from '../shared/RichImgPreview'

enum EventType {
  pay = 'pay',
  redeem = 'redeem',
}

type ActivityEvent =
  | (PayEvent & { type: EventType.pay })
  | (RedeemEvent & { type: EventType.redeem })

export default function ProjectActivity() {
  const { colors } = useContext(ThemeContext).theme
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [activityTab, setActivityTab] = useState<EventType>(EventType.pay)
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [loadingActivity, setLoadingActivity] = useState<boolean>()

  const { projectId, tokenSymbol } = useContext(ProjectContext)

  const pageSize = 100

  useEffect(() => {
    setEvents([])
    setPageNumber(0)
  }, [activityTab])

  useEffect(() => {
    setLoadingActivity(true)

    const newEvents = pageNumber ? events : []

    // Load pay events
    if (activityTab === 'pay') {
      axios
        .post(
          subgraphUrl,
          {
            query: formatGraphQuery<PayEvent>({
              entity: 'payEvent',
              keys: ['amount', 'beneficiary', 'id', 'note', 'timestamp'],
              first: pageSize,
              skip: pageNumber * pageSize,
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
        .then((res: AxiosResponse<{ data: { payEvents: PayEvent[] } }>) => {
          newEvents.push(
            ...res.data?.data?.payEvents.map(
              e =>
                ({
                  ...e,
                  type: EventType.pay,
                } as ActivityEvent),
            ),
          )
          setEvents(newEvents)
          setLoadingActivity(false)
        })
        .catch(err => {
          console.log('Error getting pay events', err)
          setLoadingActivity(false)
        })
    }

    if (activityTab === 'redeem') {
      // Load redeem events
      axios
        .post(
          subgraphUrl,
          {
            query: formatGraphQuery<RedeemEvent>({
              entity: 'redeemEvent',
              keys: [
                'amount',
                'beneficiary',
                'id',
                'returnAmount',
                'timestamp',
              ],
              first: pageSize,
              skip: pageNumber * pageSize,
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
        .then(
          (res: AxiosResponse<{ data: { redeemEvents: RedeemEvent[] } }>) => {
            newEvents.push(
              ...res.data?.data?.redeemEvents.map(
                e =>
                  ({
                    ...e,
                    type: EventType.redeem,
                  } as ActivityEvent),
              ),
            )
            setEvents(newEvents)
            setLoadingActivity(false)
          },
        )
        .catch(err => {
          console.log('Error getting redeem events', err)
          setLoadingActivity(false)
        })
    }
  }, [projectId, activityTab, pageNumber, setEvents])

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    color: colors.text.tertiary,
  }

  const contentLineHeight = 1.5

  const parseLink = (note: string) => {
    const https = 'https://'
    const http = 'http://'

    if (note.includes(https)) {
      return https + note.split(https)[1].split(' ')[0]
    } else if (note.includes(http)) {
      return http + note.split(http)[1].split(' ')[0]
    }
  }

  const formatPayEvent = (e: PayEvent) => (
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
            {formatHistoricalDate(BigNumber.from(e.timestamp).mul(1000))}
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
            <FormattedAddress address={e.beneficiary} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', marginTop: 5 }}>
        <RichImgPreview src={parseLink(e.note)} style={{ marginRight: 10 }} />

        <div
          style={{ color: colors.text.secondary }}
          dangerouslySetInnerHTML={{
            __html: Autolinker.link(e.note, {
              sanitizeHtml: true,
              className: 'quiet',
              truncate: {
                length: 30,
                location: 'smart',
              },
            }),
          }}
        ></div>
      </div>
    </div>
  )

  const formatRedeemEvent = (e: RedeemEvent) => (
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
            {formatHistoricalDate(BigNumber.from(e.timestamp).mul(1000))}
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
            <FormattedAddress address={e.beneficiary} />
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
  )

  const formatEventByType = (event: ActivityEvent) => {
    switch (event.type) {
      case EventType.pay:
        return formatPayEvent(event)
      case EventType.redeem:
        return formatRedeemEvent(event)
    }
  }

  const sortByTimestamp = <E extends { timestamp: BigNumberish }>(
    events: E[],
  ) =>
    events.sort((a, b) =>
      BigNumber.from(a.timestamp).lt(BigNumber.from(b.timestamp)) ? 1 : -1,
    )

  const tab = (tab: EventType, selected: boolean) => {
    let text: string

    switch (tab) {
      case EventType.pay:
        text = 'Payments'
        break
      case EventType.redeem:
        text = 'Redeems'
        break
    }

    return (
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          fontWeight: selected ? 600 : 400,
          color: selected ? colors.text.secondary : colors.text.tertiary,
          cursor: 'pointer',
        }}
        onClick={() => setActivityTab(tab)}
      >
        {text}
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Space size="middle">
          {tab(EventType.pay, activityTab === EventType.pay)}
          {tab(EventType.redeem, activityTab === EventType.redeem)}
        </Space>
      </div>
      <div>
        {events && events.length ? (
          sortByTimestamp(events).map(event => (
            <div key={event.id}>{formatEventByType(event)}</div>
          ))
        ) : loadingActivity ? null : (
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

      {events.length && events.length % pageSize === 0 && !loadingActivity ? (
        <div
          style={{
            textAlign: 'center',
            color: colors.text.secondary,
            cursor: 'pointer',
          }}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          Load more
        </div>
      ) : null}

      {loadingActivity && <Loading />}
    </div>
  )
}
