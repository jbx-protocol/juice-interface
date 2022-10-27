import { TeamOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { SafeTransactionType } from 'models/safe'
import { useContext } from 'react'

export function TransactionSigStatus({
  transaction,
}: {
  transaction: SafeTransactionType
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        color: colors.text.primary,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <TeamOutlined style={{ marginRight: 5 }} />
      {transaction.confirmations?.length ?? 0}/{transaction.threshold}
    </div>
  )
}
