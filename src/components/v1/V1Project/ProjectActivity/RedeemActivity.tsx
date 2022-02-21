import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import EtherscanLink from 'components/shared/EtherscanLink'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import React, { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { V1_CURRENCY_ETH } from 'constants/v1/currency'

import ActivityTabContent from './ActivityTabContent'
import { contentLineHeight, smallHeaderStyle } from './styles'

export function RedeemActivity({ pageSize }: { pageSize: number }) {
  const { projectId, tokenSymbol } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const {
    data: redeemEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteSubgraphQuery({
    pageSize,
    entity: 'redeemEvent',
    keys: [
      'amount',
      'beneficiary',
      'id',
      'returnAmount',
      'timestamp',
      'txHash',
    ],
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
      count={
        redeemEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0
      }
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      isLoadingNextPage={isFetchingNextPage}
      onLoadMore={fetchNextPage}
    >
      {redeemEvents?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group?.map(e => (
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
                  <div style={smallHeaderStyle(colors)}>Redeemed</div>
                  <div
                    style={{
                      lineHeight: contentLineHeight,
                      fontSize: '1rem',
                    }}
                  >
                    {formatWad(e.amount, { precision: 0 })}{' '}
                    {tokenSymbolText({
                      tokenSymbol: tokenSymbol,
                      capitalize: false,
                      plural: true,
                    })}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      ...smallHeaderStyle(colors),
                      textAlign: 'right',
                    }}
                  >
                    {e.timestamp && (
                      <span>{formatHistoricalDate(e.timestamp * 1000)}</span>
                    )}{' '}
                    <EtherscanLink value={e.txHash} type="tx" />
                  </div>
                  <div
                    style={{
                      ...smallHeaderStyle(colors),
                      lineHeight: contentLineHeight,
                      textAlign: 'right',
                    }}
                  >
                    <FormattedAddress address={e.beneficiary} />
                  </div>
                </div>
              </div>

              <div style={{ color: colors.text.secondary }}>
                <CurrencySymbol currency={V1_CURRENCY_ETH} />
                {formatWad(e.returnAmount, { precision: 4 })} overflow received
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </ActivityTabContent>
  )
}
