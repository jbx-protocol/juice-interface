import CurrencySymbol from 'components/shared/CurrencySymbol'
import EtherscanLink from 'components/shared/EtherscanLink'
import FormattedAddress from 'components/shared/FormattedAddress'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import { contentLineHeight, smallHeaderStyle } from './styles'
import useSubgraphQuery from '../../../hooks/SubgraphQuery'

export function RedeemActivity({
  pageNumber,
  pageSize,
  setLoading,
  setCount,
}: {
  pageNumber: number
  pageSize: number
  setLoading: (loading: boolean) => void
  setCount: (count: number) => void
}) {
  const { projectId, tokenSymbol } = useContext(ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { data: redeemEvents } = useSubgraphQuery(
    {
      entity: 'redeemEvent',
      keys: [
        'amount',
        'beneficiary',
        'id',
        'returnAmount',
        'timestamp',
        'txHash',
      ],
      first: pageSize,
      skip: pageNumber * pageSize,
      orderDirection: 'desc',
      orderBy: 'timestamp',
      where: projectId
        ? {
            key: 'project',
            value: projectId.toString(),
          }
        : undefined,
    },
    {
      onSuccess: data => {
        setLoading(false)
        setCount(data.length)
      },
    },
  )

  return (
    <div>
      {redeemEvents?.map(e => (
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
                {formatWad(e.amount, { decimals: 0 })} {tokenSymbol ?? 'tokens'}
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
            <CurrencySymbol currency={0} />
            {formatWad(e.returnAmount, { decimals: 4 })} overflow received
          </div>
        </div>
      ))}
    </div>
  )
}
