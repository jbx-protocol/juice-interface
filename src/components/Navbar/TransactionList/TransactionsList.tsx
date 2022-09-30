import { CaretDownOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { timestampForTxLog, TxHistoryContext } from 'contexts/txHistoryContext'
import { TxStatus } from 'models/transaction'
import { CSSProperties, useContext, useEffect, useMemo, useState } from 'react'
import Loading from '../../Loading'
import { TransactionItem } from './TransactionItem'

export function TransactionsList({
  style,
  listStyle,
}: {
  style?: CSSProperties
  listStyle?: CSSProperties
}) {
  const { transactions, removeTransaction } = useContext(TxHistoryContext)
  const [isExpanded, setIsExpanded] = useState<boolean>()

  const hasPendingTxs = useMemo(
    () => transactions?.some(tx => tx.status === TxStatus.pending),
    [transactions],
  )

  useEffect(() => {
    // Auto expand if pending tx is added
    if (hasPendingTxs) {
      setIsExpanded(true)
    }
  }, [hasPendingTxs])

  return (
    <div style={{ ...style }}>
      {!!transactions?.length && (
        <div
          className="clickable-border"
          role="button"
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 5,
            borderRadius: 15,
            height: 30,
            userSelect: 'none',
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {hasPendingTxs ? <Loading size="small" /> : <ThunderboltOutlined />}
          <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>
            {isExpanded ? <CaretDownOutlined /> : transactions.length}
          </span>
        </div>
      )}

      {isExpanded && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            ...listStyle,
          }}
        >
          {transactions?.length ? (
            transactions
              .sort((a, b) =>
                timestampForTxLog(a) > timestampForTxLog(b) ? -1 : 1,
              )
              .map(tx =>
                tx ? (
                  <TransactionItem
                    key={tx.tx?.hash}
                    tx={tx}
                    onRemoveTransaction={
                      removeTransaction
                        ? () => {
                            removeTransaction(tx.id)

                            // Close menu if removing last tx
                            if (transactions.length === 1 && isExpanded) {
                              setIsExpanded(false)
                            }
                          }
                        : undefined
                    }
                  />
                ) : null,
              )
          ) : (
            <div style={{ fontWeight: 600 }}>
              <Trans>No transaction history</Trans>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
