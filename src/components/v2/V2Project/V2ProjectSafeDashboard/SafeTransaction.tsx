import { ThemeContext } from 'contexts/themeContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext, useMemo, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import ReconfigurePreview from '../V2ProjectSettings/pages/V2ProjectReconfigureFundingCycleSettingsPage/ReconfigurePreview'
import { SafeTransactionType } from './V2ProjectSafeDashboard'

type SafeTransactionComponentProps = {
  transaction: SafeTransactionType
}

const ReconfigureFundingCyclesOfTransaction = ({
  transaction,
}: SafeTransactionComponentProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [expanded, setExpanded] = useState<boolean>(false)

  const { contracts } = useContext(V2UserContext)

  if (!contracts || !transaction.data) return null

  const decodedData = contracts['JBController'].interface.parseTransaction({
    data: transaction.data,
  }).args

  return (
    <div
      style={{
        width: '100%',
        border: '1px solid ' + colors.stroke.tertiary,
        padding: '0.5rem 1rem',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between' }}
        onClick={() => setExpanded(true)}
      >
        <div>
          <span style={{ marginRight: '2rem', color: colors.text.secondary }}>
            {transaction.nonce}
          </span>
          <span>Funding cycle reconfiguration</span>
        </div>
        <div>
          {formatHistoricalDate(new Date(transaction.submissionDate).valueOf())}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '2rem', marginLeft: '4rem' }}>
          <ReconfigurePreview
            payoutSplits={[]}
            reserveSplits={[]}
            fundingCycleMetadata={decodedData._metadata}
            fundingCycleData={decodedData._data}
            fundAccessConstraints={decodedData._fundAccessConstraints}
          />
        </div>
      )}
    </div>
  )
}

const GenericSafeTransaction = ({
  transaction,
}: SafeTransactionComponentProps) => {
  return <div>{transaction.dataDecoded?.method}</div>
}

const TRANSACTION_METHOD_COMPONENTS_MAP: {
  [k: string]: (props: SafeTransactionComponentProps) => JSX.Element | null
} = {
  reconfigureFundingCyclesOf: ReconfigureFundingCyclesOfTransaction,
}

export function SafeTransaction({
  transaction,
}: {
  transaction: SafeTransactionType
}) {
  const { method } = transaction.dataDecoded ?? {}

  const Component = useMemo(() => {
    if (!method) return GenericSafeTransaction
    return TRANSACTION_METHOD_COMPONENTS_MAP[method] ?? GenericSafeTransaction
  }, [method])

  return <Component transaction={transaction} />
}
