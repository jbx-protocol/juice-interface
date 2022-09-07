import {
  CaretDownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { NetworkName } from 'models/network-name'
import { TxStatus } from 'models/transaction'
import { CSSProperties, useContext, useEffect, useMemo, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { readNetwork } from '../../constants/networks'
import {
  timestampForTxLog,
  TxHistoryContext,
} from '../../contexts/txHistoryContext'
import Loading from '../Loading'

export default function TransactionsList({
  style,
  listStyle,
}: {
  style?: CSSProperties
  listStyle?: CSSProperties
}) {
  const { transactions, removeTransaction } = useContext(TxHistoryContext)
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

  const hasPendingTxs = useMemo(
    () => transactions?.some(tx => tx.status === TxStatus.pending),
    [transactions],
  )

  useEffect(() => {
    // Auto expand if pending tx is added
    if (hasPendingTxs) setIsExpanded(true)
  }, [hasPendingTxs])

  return (
    <div style={{ ...style }}>
      {transactions?.length && (
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
                    background: colors.background.l0,
                    border: `1px solid ${colors.stroke.secondary}`,
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

                  {removeTransaction && (
                    <CloseCircleOutlined
                      style={{ cursor: 'default' }}
                      onClick={() => {
                        removeTransaction(tx.id)

                        // Close menu if removing last tx
                        if (transactions.length === 1 && isExpanded) {
                          setIsExpanded(false)
                        }
                      }}
                    />
                  )}
                </div>
              ))
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
