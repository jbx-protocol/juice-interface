import { BigNumber } from '@ethersproject/bignumber'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { useDistributePayoutsEvents } from './hooks/DistributePayoutsEvents'

interface DistributePayoutEvent {
  id: string
  splitProjectId: number
  beneficiary: string
  amount: BigNumber
}

function PayoutAddressAmount({
  splitProjectId,
  beneficiary,
  amount,
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
        fontSize: '0.8rem',
      }}
    >
      <div style={{ fontWeight: 500 }}>
        {splitProjectId ? (
          <span>Project {splitProjectId}</span>
        ) : (
          <FormattedAddress address={beneficiary} />
        )}
      </div>
      <div style={{ color: colors.text.secondary }}>
        <ETHAmount amount={amount} />
      </div>
    </div>
  )
}

export function DistributePayoutsEventExtra({
  id,
  beneficiaryDistributionAmount,
  beneficiary,
}: {
  id: string | undefined
  beneficiaryDistributionAmount: BigNumber | undefined
  beneficiary: string | undefined
}) {
  const distributePayoutsEvents = useDistributePayoutsEvents({ id })
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <>
      {distributePayoutsEvents &&
        distributePayoutsEvents.map(e => (
          <PayoutAddressAmount
            amount={e.amount}
            beneficiary={e.beneficiary}
            id={e.id}
            splitProjectId={e.splitProjectId}
            key={e.id}
          />
        ))}
      {beneficiaryDistributionAmount?.gt(0) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: distributePayoutsEvents?.length ? '0.8rem' : undefined,
          }}
        >
          <div style={{ fontWeight: 500 }}>
            <FormattedAddress address={beneficiary} />
          </div>
          <div
            style={
              distributePayoutsEvents?.length
                ? { color: colors.text.secondary }
                : { fontWeight: 500 }
            }
          >
            <ETHAmount amount={beneficiaryDistributionAmount} />
          </div>
        </div>
      )}
    </>
  )
}
