import { BigNumber } from '@ethersproject/bignumber'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { useDistributeReservedTokensEvents } from './hooks/DistributeReservedTokensEvents'

interface DistributePayoutEvent {
  id: string
  beneficiary: string
  tokenCount: BigNumber
  multipleReservedTokens: boolean
}

function ReservedTokenAddressAmount({
  beneficiary,
  tokenCount,
  multipleReservedTokens,
}: DistributePayoutEvent) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>
        <FormattedAddress address={beneficiary} />:
      </div>
      <div
        style={
          multipleReservedTokens
            ? { color: colors.text.secondary, fontSize: '0.8rem' }
            : { fontWeight: 500 }
        }
      >
        {formatWad(tokenCount, { precision: 0 })}
      </div>
    </div>
  )
}

export function DistributeReservedTokensEventExtra({
  id,
  beneficiaryTokenCount,
  beneficiary,
}: {
  id: string | undefined
  beneficiaryTokenCount: BigNumber | undefined
  beneficiary: string | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const distributeReservedTokensEvents = useDistributeReservedTokensEvents({
    id,
  })

  return (
    <>
      {distributeReservedTokensEvents?.map(e => (
        <ReservedTokenAddressAmount
          key={e.id}
          beneficiary={e.beneficiary}
          id={e.id}
          multipleReservedTokens={distributeReservedTokensEvents.length > 1}
          tokenCount={e.tokenCount}
        />
      ))}

      {beneficiaryTokenCount?.gt(0) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div style={{ fontWeight: 500 }}>
            <FormattedAddress address={beneficiary} />:
          </div>
          <div style={{ color: colors.text.secondary }}>
            {formatWad(beneficiaryTokenCount, {
              precision: 0,
            })}
          </div>
        </div>
      )}
    </>
  )
}
