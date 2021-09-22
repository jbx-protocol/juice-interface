import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { Select } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import {
  parsePayerReportJson,
  PayerReport,
} from 'models/subgraph-entities/payer-report'
import { useContext, useEffect, useMemo, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { OrderDirection, querySubgraph, trimHexZero } from 'utils/graph'

import { contentLineHeight, smallHeaderStyle } from './styles'

export function PayerReports({
  pageSize,
  pageNumber,
  setLoading,
  setCount,
}: {
  pageSize: number
  pageNumber: number
  setLoading: (loading: boolean) => void
  setCount: (count: number) => void
}) {
  const [payerReports, setPayerReports] = useState<PayerReport[]>([])
  const [sortPayerReports, setSortPayerReports] =
    useState<keyof PayerReport>('totalPaid')
  const [sortPayerReportsDirection, setSortPayerReportsDirection] =
    useState<OrderDirection>('desc')
  const { projectId } = useContext(ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useEffect(() => {
    setLoading(true)

    querySubgraph(
      {
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
      },
      res => {
        if (!res) return

        const newEvents = [...payerReports]
        newEvents.push(...res.payerReports.map(e => parsePayerReportJson(e)))
        setPayerReports(newEvents)
        setLoading(false)
        setCount(newEvents.length)
      },
    )
  }, [
    pageNumber,
    pageSize,
    projectId,
    sortPayerReportsDirection,
    sortPayerReports,
  ])

  return useMemo(
    () => (
      <div>
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
            onChange={(val: keyof PayerReport) => {
              setPayerReports([])
              setSortPayerReports(val)
            }}
            value={sortPayerReports}
          >
            <Select.Option value="totalPaid">Amount</Select.Option>
            <Select.Option value="lastPaidTimestamp">Latest</Select.Option>
          </Select>
          <div
            style={{ cursor: 'pointer', padding: 10 }}
            onClick={() => {
              setPayerReports([])
              setSortPayerReportsDirection(
                sortPayerReportsDirection === 'asc' ? 'desc' : 'asc',
              )
            }}
          >
            {sortPayerReportsDirection === 'asc' ? (
              <SortAscendingOutlined />
            ) : (
              <SortDescendingOutlined />
            )}
          </div>
        </div>
        {payerReports.map(e => (
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
                    marginRight: 10,
                  }}
                >
                  <FormattedAddress address={e.payer} />
                </div>
                {e.lastPaidTimestamp && (
                  <div style={smallHeaderStyle(colors)}>
                    Last paid {formatHistoricalDate(e.lastPaidTimestamp * 1000)}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                  }}
                >
                  <CurrencySymbol currency={0} />
                  {formatWad(e.totalPaid)}
                </div>
                <div style={smallHeaderStyle(colors)}>Total contributed</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    [payerReports, colors, sortPayerReports, sortPayerReportsDirection],
  )
}
