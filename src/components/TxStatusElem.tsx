import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { TxStatus } from 'models/transaction'
import React, { useContext } from 'react'
import Loading from './Loading'

export default function TxStatusElem({ status }: { status: TxStatus }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
