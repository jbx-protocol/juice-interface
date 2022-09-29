import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'

import { useContext, useState } from 'react'

import {
  SafeTransactionComponentProps,
  safeTransactionRowStyle,
  TransactionHeader,
} from '../../SafeTransaction'
import { ReconfigureRichPreview } from './ReconfigurationRichPreview'

export function ReconfigureFundingCyclesOfTransaction({
  transaction,
}: SafeTransactionComponentProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <div
      style={{
        ...safeTransactionRowStyle,
        color: colors.text.primary,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(!expanded)}
      className="clickable-border"
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <TransactionHeader
          transaction={transaction}
          title={t`Reconfigure funding cycle`}
        />
        <div style={{ marginLeft: 10 }}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>

      {expanded && <ReconfigureRichPreview transaction={transaction} />}
    </div>
  )
}
