import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { TxStatus } from 'models/transaction'
import Loading from './Loading'

export default function TxStatusElem({ status }: { status: TxStatus }) {
  switch (status) {
    case TxStatus.pending:
      return <Loading size="small" />
    case TxStatus.success:
      return (
        <div className="text-success-700 dark:text-success-200">
          <CheckCircleOutlined />
        </div>
      )
    case TxStatus.failed:
      return (
        <div className="text-error-500 dark:text-error-400">
          <ExclamationCircleOutlined />
        </div>
      )
  }
}
