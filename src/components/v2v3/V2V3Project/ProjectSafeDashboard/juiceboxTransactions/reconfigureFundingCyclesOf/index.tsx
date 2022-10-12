import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext, useState } from 'react'
import { SafeTransactionComponentProps } from '../../SafeTransaction'
import { TransactionHeader } from '../../TransactionHeader'
import { ReconfigureRichPreview } from './ReconfigurationRichPreview'

export function ReconfigureFundingCyclesOfTransaction({
  transaction,
  selected,
  isPastTransaction,
}: SafeTransactionComponentProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [expanded, setExpanded] = useState<boolean>(selected)

  const rowStyle: CSSProperties = {
    color: colors.text.primary,
    marginBottom: '1.5rem',
  }

  return (
    <div
      style={rowStyle}
      onClick={() => {
        setExpanded(!expanded)
      }}
      id={`${transaction.safeTxHash}`}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <TransactionHeader
          transaction={transaction}
          title={t`Reconfigure funding cycle`}
          isPastTransaction={isPastTransaction}
        />
        <div style={{ marginLeft: 10, color: colors.text.tertiary }}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>

      {expanded && <ReconfigureRichPreview transaction={transaction} />}
    </div>
  )
}
