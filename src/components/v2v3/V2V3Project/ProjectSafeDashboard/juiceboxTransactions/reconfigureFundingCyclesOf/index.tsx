import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext, useState } from 'react'
import {
  SafeTransactionComponentProps,
  safeTransactionRowStyle,
} from '../../SafeTransaction'
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
    ...safeTransactionRowStyle,
    color: colors.text.primary,
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  }

  if (selected) {
    rowStyle.border = `1px solid ${colors.stroke.action.primary}`
  }

  return (
    <div
      style={rowStyle}
      onClick={() => {
        setExpanded(!expanded)
      }}
      className="clickable-border"
      id={`${transaction.safeTxHash}`}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <TransactionHeader
          transaction={transaction}
          title={t`Reconfigure funding cycle`}
          isPastTransaction={isPastTransaction}
        />
        <div style={{ marginLeft: 10 }}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>

      {expanded && <ReconfigureRichPreview transaction={transaction} />}
    </div>
  )
}
