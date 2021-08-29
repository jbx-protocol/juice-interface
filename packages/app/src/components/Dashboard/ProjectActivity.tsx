import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { Select, Space } from 'antd'
import Autolinker from 'autolinker'
import axios, { AxiosResponse } from 'axios'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import Loading from 'components/shared/Loading'
import { subgraphUrl } from 'constants/subgraphs'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import {
  parsePayEventJson,
  PayEvent,
  PayEventJson,
} from 'models/subgraph-entities/pay-event'
import {
  parsePayerReportJson,
  PayerReport,
  PayerReportJson,
} from 'models/subgraph-entities/payer-report'
import {
  parseRedeemEventJson,
  RedeemEvent,
  RedeemEventJson,
} from 'models/subgraph-entities/redeem-event'
import {
  CSSProperties,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { formatGraphQuery, OrderDirection, trimHexZero } from 'utils/graph'

import RichImgPreview from '../shared/RichImgPreview'

enum EventType {
  pay = 'pay',
  redeem = 'redeem',
  payerReport = 'payerReport',
}

// Maps a project id to an internal map of payment event overrides.
let payEventOverrides = new Map<string, Map<string, string>>([
  [
    '10',
    new Map<string, string>([
      ['Minted WikiToken for Page ID', 'WikiToken minted'],
    ]),
  ],
])

export default function ProjectActivity() {
  const { colors } = useContext(ThemeContext).theme
  const [initialized, setInitialized] = useState<boolean>()
  const [payEvents, setPayEvents] = useState<PayEvent[]>([])
  const [payerReports, setPayerReports] = useState<PayerReport[]>([])
  const [sortPayerReports, setSortPayerReports] =
    useState<keyof PayerReport>('totalPaid')
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>('desc')
  const [redeemEvents, setRedeemEvents] = useState<RedeemEvent[]>([])
  const [activityTab, setActivityTab] = useState<EventType>()
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>()

  const { projectId, tokenSymbol } = useContext(ProjectContext)

  const usePayEventOverrides =
    projectId && payEventOverrides.has(projectId.toString())

  const pageSize = 100

  const loadPayEvents = (reset?: boolean) => {
    if (reset) setPayEvents([])
    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery({
            entity: 'payEvent',
            keys: ['amount', 'beneficiary', 'note', 'timestamp'],
            first: pageSize,
            skip: pageNumber * pageSize,
            orderDirection: 'desc',
            orderBy: 'timestamp',
            where: projectId
              ? {
                  key: 'project',
                  value: trimHexZero(projectId.toHexString()),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { payEvents: PayEventJson[] } }>) => {
        const newEvents = reset ? [] : [...payEvents]
        newEvents.push(
          ...res.data?.data?.payEvents.map(e => parsePayEventJson(e)),
        )
        setPayEvents(newEvents)
        setLoading(false)
      })
      .catch(err => {
        console.log('Error getting pay events', err)
        setLoading(false)
      })
  }

  const loadPayerReports = (reset?: boolean) => {
    if (reset) setPayerReports([])
    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery({
            entity: 'payerReport',
            keys: ['payer', 'totalPaid', 'lastPaidTimestamp'],
            first: pageSize,
            skip: pageNumber * pageSize,
            orderBy: sortPayerReports,
            orderDirection: sortPayerReportsDirection,
            where: projectId
              ? {
                  key: 'project',
                  value: trimHexZero(projectId.toHexString()),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then(
        (res: AxiosResponse<{ data: { payerReports: PayerReportJson[] } }>) => {
          const newEvents = reset ? [] : [...payerReports]
          newEvents.push(
            ...res.data?.data?.payerReports.map(e => parsePayerReportJson(e)),
          )
          setPayerReports(newEvents)
          setLoading(false)
        },
      )
      .catch(err => console.log('Error getting payer reports', err))
  }

  const loadRedeemEvents = (reset?: boolean) => {
    if (reset) setRedeemEvents([])
    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery({
            entity: 'redeemEvent',
            keys: ['amount', 'beneficiary', 'id', 'returnAmount', 'timestamp'],
            first: pageSize,
            skip: pageNumber * pageSize,
            orderDirection: 'desc',
            orderBy: 'timestamp',
            where: projectId
              ? {
                  key: 'project',
                  value: trimHexZero(projectId.toHexString()),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then(
        (res: AxiosResponse<{ data: { redeemEvents: RedeemEventJson[] } }>) => {
          const newEvents = reset ? [] : [...redeemEvents]
          newEvents.push(
            ...res.data?.data?.redeemEvents.map(e => parseRedeemEventJson(e)),
          )
          setRedeemEvents(newEvents)
          setLoading(false)
        },
      )
      .catch(err => {
        console.log('Error getting redeem events', err)
        setLoading(false)
      })
  }

  useLayoutEffect(() => {
    setLoading(true)

    switch (activityTab) {
      case EventType.pay:
        loadPayEvents()
        break
      case EventType.redeem:
        loadRedeemEvents()
        break
      case EventType.payerReport:
        loadPayerReports()
        break
    }
  }, [pageNumber])

  useLayoutEffect(() => {
    setLoading(true)

    switch (activityTab) {
      case EventType.pay:
        loadPayEvents(true)
        break
      case EventType.redeem:
        loadRedeemEvents(true)
        break
      case EventType.payerReport:
        loadPayerReports(true)
        break
    }
  }, [activityTab])

  useLayoutEffect(() => {
    setLoading(true)
    loadPayerReports(true)
  }, [sortPayerReports, sortPayerReportsDirection])

  useLayoutEffect(() => {
    if (initialized) return

    setInitialized(true)

    setActivityTab(projectId?.eq(7) ? EventType.redeem : EventType.pay)
  }, [initialized, setInitialized, activityTab, projectId])

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

  const formatPayEventOverride = (e: Partial<PayEvent>) => {
    if (!projectId) {
      return e.note
    }

    let override
    payEventOverrides
      .get(projectId.toString())
      ?.forEach((value: string, key: string) => {
        if (e.note?.includes(key)) {
          override = value
          return
        }
      })

    return override ? override : e.note
  }

  const payEventElems = useMemo(
    () =>
      payEvents.map(e => (
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
              {e.timestamp && (
                <div
                  style={{
                    ...smallHeaderStyle,
                    textAlign: 'right',
                    color: colors.text.secondary,
                  }}
                >
                  {formatHistoricalDate(e.timestamp * 1000)}
                </div>
              )}
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

          <div style={{ display: 'flex', marginTop: 5, overflowX: 'scroll' }}>
            {e.note && (
              <RichImgPreview
                src={parseLink(e.note)}
                style={{ marginRight: 10 }}
              />
            )}

            {
              <div
                style={{ color: colors.text.secondary }}
                dangerouslySetInnerHTML={{
                  __html: Autolinker.link(
                    (usePayEventOverrides
                      ? formatPayEventOverride(e)
                      : e.note) ?? '',
                    {
                      sanitizeHtml: true,
                      className: 'quiet',
                      truncate: {
                        length: 30,
                        location: 'smart',
                      },
                    },
                  ),
                }}
              ></div>
            }
          </div>
        </div>
      )),
    [payEvents, colors],
  )

  const payerReportElems = useMemo(
    () =>
      payerReports.map(e => (
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
              <div
                style={{
                  lineHeight: contentLineHeight,
                  fontSize: '1rem',
                  marginRight: 10,
                  color: colors.text.primary,
                }}
              >
                <FormattedAddress address={e.payer} />
              </div>
              {e.lastPaidTimestamp && (
                <div style={smallHeaderStyle}>
                  Last paid {formatHistoricalDate(e.lastPaidTimestamp * 1000)}
                </div>
              )}
            </div>

            <div>
              <div
                style={{
                  lineHeight: contentLineHeight,
                  textAlign: 'right',
                }}
              >
                <CurrencySymbol currency={0} />
                {formatWad(e.totalPaid)}
              </div>
              <div
                style={{
                  ...smallHeaderStyle,
                  textAlign: 'right',
                }}
              >
                Total contributed
              </div>
            </div>
          </div>
        </div>
      )),
    [payerReports, colors],
  )

  const redeemEventElems = useMemo(
    () =>
      redeemEvents.map(e => (
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
              {e.timestamp && (
                <div
                  style={{
                    ...smallHeaderStyle,
                    textAlign: 'right',
                    color: colors.text.secondary,
                  }}
                >
                  {formatHistoricalDate(e.timestamp * 1000)}
                </div>
              )}
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
      )),
    [redeemEvents, colors],
  )

  const eventElems = useMemo(() => {
    const noActivity = (
      <div
        style={{
          color: colors.text.secondary,
          paddingTop: 20,
          borderTop: '1px solid ' + colors.stroke.tertiary,
        }}
      >
        No activity yet
      </div>
    )

    let elems: JSX.Element[] = []

    switch (activityTab) {
      case EventType.pay:
        elems = payEventElems
        break
      case EventType.payerReport:
        elems = payerReportElems
        break
      case EventType.redeem:
        elems = redeemEventElems
        break
    }

    return <div>{elems?.length ? elems : loading ? null : noActivity}</div>
  }, [activityTab, payEventElems, redeemEventElems, payerReportElems])

  const elemsCount = useMemo(() => {
    switch (activityTab) {
      case EventType.pay:
        return payEvents.length
      case EventType.payerReport:
        return payerReports.length
      case EventType.redeem:
        return redeemEvents.length
    }
  }, [activityTab, payEvents, payerReports, redeemEvents])

  const tab = (tab: EventType, selected: boolean) => {
    let text: string

    switch (tab) {
      case EventType.pay:
        text = 'Payments'
        break
      case EventType.redeem:
        text = 'Redeems'
        break
      case EventType.payerReport:
        text = 'Contributors'
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
        {projectId?.eq(7) ? (
          <Space size="middle">
            {tab(EventType.redeem, activityTab === EventType.redeem)}
            {tab(EventType.payerReport, activityTab === EventType.payerReport)}
          </Space>
        ) : (
          <Space size="middle">
            {tab(EventType.pay, activityTab === EventType.pay)}
            {tab(EventType.redeem, activityTab === EventType.redeem)}
            {tab(EventType.payerReport, activityTab === EventType.payerReport)}
          </Space>
        )}
      </div>

      <div
        style={{
          height: '200vh',
          overflow: 'auto',
          paddingBottom: 40,
        }}
      >
        {activityTab === EventType.payerReport && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Select
              style={{ flex: 1 }}
              onChange={(val: keyof PayerReport) => setSortPayerReports(val)}
              value={sortPayerReports}
            >
              <Select.Option value="totalPaid">Amount</Select.Option>
              <Select.Option value="lastPaidTimestamp">Latest</Select.Option>
            </Select>
            <div
              style={{ cursor: 'pointer', padding: 10 }}
              onClick={() =>
                setSortPayerReportsDirection(
                  sortPayerReportsDirection === 'asc' ? 'desc' : 'asc',
                )
              }
            >
              {sortPayerReportsDirection === 'asc' ? (
                <SortAscendingOutlined />
              ) : (
                <SortDescendingOutlined />
              )}
            </div>
          </div>
        )}

        {eventElems}

        {elemsCount && elemsCount % pageSize === 0 && !loading ? (
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
        ) : loading ? null : (
          <div
            style={{
              textAlign: 'center',
              padding: 10,
              color: colors.text.secondary,
            }}
          >
            {elemsCount} total
          </div>
        )}

        {loading && (
          <div>
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}
