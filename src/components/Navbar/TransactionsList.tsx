import {
  CaretDownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { NetworkName } from 'models/network-name'
import { TxStatus } from 'models/transaction'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { readNetwork } from '../../constants/networks'
import {
  timestampForTxLog,
  TransactionsContext,
} from '../../contexts/transactionsContext'
import Loading from '../Loading'

export default function TransactionsList({
  style,
  listStyle,
}: {
  style?: CSSProperties
  listStyle?: CSSProperties
}) {
  const { transactions, removeTransaction } = useContext(TransactionsContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [isExpanded, setIsExpanded] = useState<boolean>()

  const TxStatusElem = (status: TxStatus) => {
    switch (status) {
      case TxStatus.pending:
        return <Loading size="small" />
      case TxStatus.success:
        return (
          <div style={{ color: colors.icon.success }}>
            <CheckCircleOutlined />
          </div>
        )
      case TxStatus.failed:
        return (
          <div style={{ color: colors.icon.failure }}>
            <ExclamationCircleOutlined />
          </div>
        )
    }
  }

  useEffect(() => {
    // Auto expand if pending tx is added
    if (transactions?.some(tx => tx.status === TxStatus.pending)) {
      setIsExpanded(true)
    }
  }, [transactions])

  return (
    <div style={{ ...style }}>
      {!!transactions?.length && (
        <Button
          style={{ paddingLeft: 5, paddingRight: 5 }}
          type="text"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          TXS{' '}
          <span style={{ minWidth: 20 }}>
            {isExpanded ? <CaretDownOutlined /> : transactions.length}
          </span>
        </Button>
      )}

      {isExpanded && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: 300,
            ...listStyle,
          }}
        >
          {transactions?.length ? (
            transactions
              .sort((a, b) =>
                timestampForTxLog(a) > timestampForTxLog(b) ? -1 : 1,
              )
              .map(tx => (
                <div
                  key={tx.tx.hash}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    width: '100%',
                    padding: '5px 20px',
                    background: colors.background.l1,
                    boxSizing: 'border-box',
                  }}
                >
                  <a
                    style={{
                      cursor: tx.tx.hash ? 'pointer' : 'default',
                      color: colors.text.primary,
                      fontSize: '0.7rem',
                      lineHeight: '1.5rem',
                    }}
                    href={
                      tx.tx.hash
                        ? `https://${readNetwork.name}${
                            readNetwork.name !== NetworkName.mainnet ? '.' : ''
                          }etherscan.io/tx/${tx.tx.hash}`
                        : undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 10,
                        color: colors.text.tertiary,
                      }}
                    >
                      {TxStatusElem(tx.status)}{' '}
                      {formatHistoricalDate(timestampForTxLog(tx) * 1000)}
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>{tx.title}</div>
                  </a>

                  <span
                    style={{ cursor: 'default' }}
                    onClick={() => {
                      // Close menu if removing last tx
                      if (transactions.length === 1 && isExpanded) {
                        setIsExpanded(false)
                      }

                      removeTransaction?.(tx.id)
                    }}
                  >
                    ×
                  </span>
                </div>
              ))
          ) : (
            <div style={{ fontWeight: 600 }}>No transaction history</div>
          )}
        </div>
      )}
    </div>
  )
}
