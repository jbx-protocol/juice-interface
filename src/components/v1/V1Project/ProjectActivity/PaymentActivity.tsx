import FormattedAddress from 'components/shared/FormattedAddress'
import EtherscanLink from 'components/shared/EtherscanLink'
import ETHAmount from 'components/shared/currency/ETHAmount'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { PayEvent } from 'models/subgraph-entities/pay-event'
import React, { useCallback, useContext } from 'react'

import ActivityTabContent from './ActivityTabContent'
import RichNote from '../../../shared/RichNote'
import { contentLineHeight, smallHeaderStyle } from './styles'

// Maps a project id to an internal map of payment event overrides.
let payEventOverrides = new Map<string, Map<string, string>>([
  [
    '10',
    new Map<string, string>([
      ['Minted WikiToken for Page ID', 'WikiToken minted'],
    ]),
  ],
])

export function PaymentActivity({ pageSize }: { pageSize: number }) {
  const { projectId } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const usePayEventOverrides =
    projectId && payEventOverrides.has(projectId.toString())

  const formatPayEventOverride = useCallback(
    (e: Partial<PayEvent>) => {
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
    },
    [projectId],
  )

  const {
    data: payEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteSubgraphQuery({
    pageSize,
    entity: 'payEvent',
    keys: ['id', 'amount', 'beneficiary', 'note', 'timestamp', 'txHash'],
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where: projectId
      ? {
          key: 'project',
          value: projectId.toString(),
        }
      : undefined,
  })

  return (
    <ActivityTabContent
      // Add up each page's `length`
      count={payEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      onLoadMore={fetchNextPage}
      isLoadingNextPage={isFetchingNextPage}
    >
      {payEvents?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group?.map(e => (
            <div
              key={e.id}
              style={{
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom: '1px solid ' + colors.stroke.tertiary,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignContent: 'space-between',
                }}
              >
                <div>
                  <div style={smallHeaderStyle(colors)}>Paid</div>
                  <div
                    style={{
                      lineHeight: contentLineHeight,
                      fontSize: '1rem',
                    }}
                  >
                    <ETHAmount amount={e.amount} precision={4} />
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {e.timestamp && (
                    <div style={smallHeaderStyle(colors)}>
                      <EtherscanLink
                        timestamp={e.timestamp}
                        value={e.txHash}
                        type="tx"
                      />
                    </div>
                  )}
                  <div
                    style={{
                      ...smallHeaderStyle(colors),
                      lineHeight: contentLineHeight,
                    }}
                  >
                    <FormattedAddress address={e.beneficiary} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 5 }}>
                <RichNote
                  note={
                    (usePayEventOverrides
                      ? formatPayEventOverride(e)
                      : e.note) ?? ''
                  }
                />
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </ActivityTabContent>
  )
}
