import { RightOutlined } from '@ant-design/icons'
import ExternalLink from 'components/ExternalLink'
import { ThemeContext } from 'contexts/themeContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { CSSProperties, useContext, useMemo, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { generateSafeTxUrl } from 'utils/safe'

import { SafeTransactionType } from './V2ProjectSafeDashboard'

type SafeTransactionComponentProps = {
  transaction: SafeTransactionType
}

const nonceStyle: CSSProperties = {
  marginRight: '2rem',
  width: '1rem',
}

function TransactionHeader({
  transaction,
}: {
  transaction: SafeTransactionType
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ ...nonceStyle, color: colors.text.secondary }}>
          {transaction.nonce}
        </div>
        <div>{transaction?.dataDecoded?.method}</div>
      </div>
      <div style={{ color: colors.text.secondary }}>
        {formatHistoricalDate(new Date(transaction.submissionDate).valueOf())}
        <RightOutlined style={{ marginLeft: 10 }} />
      </div>
    </>
  )
}

// The components from `TRANSACTION_METHOD_COMPONENTS_MAP` will have specific drawers when expanded
const ReconfigureFundingCyclesOfTransaction = ({
  transaction,
}: SafeTransactionComponentProps) => {
  // const [expanded, setExpanded] = useState<boolean>(false)

  const { contracts } = useContext(V2UserContext)

  if (!contracts || !transaction.data) return null

  // const decodedData = contracts['JBController'].interface.parseTransaction({
  //   data: transaction.data,
  // }).args

  return (
    <>
      <TransactionHeader transaction={transaction} />

      {/* {expanded && (
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
      </div>*/}
    </>
  )
}

const GenericSafeTransaction = ({
  transaction,
}: SafeTransactionComponentProps) => {
  return <TransactionHeader transaction={transaction} />
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [hover, setHover] = useState<boolean>(false)

  const { method } = transaction.dataDecoded ?? {}

  const safeTransactionRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    color: colors.text.primary,
    fontWeight: 400,
    width: '100%',
    border: '1px solid ' + colors.stroke.tertiary,
    padding: '0.5rem 1rem',
    marginBottom: '1rem',
    backgroundColor: hover ? colors.background.l2 : 'unset',
    transition: 'all 0.3s',
  }

  const TransactionContent = useMemo(() => {
    if (!method) return GenericSafeTransaction // only the header
    return TRANSACTION_METHOD_COMPONENTS_MAP[method] ?? GenericSafeTransaction
  }, [method])

  if (!method) return null

  return (
    <ExternalLink
      style={safeTransactionRowStyle}
      className="hover-box-shadow-sm"
      href={generateSafeTxUrl(transaction)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <TransactionContent transaction={transaction} />
    </ExternalLink>
  )
}
