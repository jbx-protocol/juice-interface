import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import Loading from 'components/Loading'
import { TxStatus } from 'models/transaction'
import { classNames } from 'utils/classNames'

export default function TxStatusIcon({ status }: { status: TxStatus }) {
  const containerClassName =
    'flex h-7 w-7 items-center justify-center rounded-full'

  const iconClassName = 'h-6 w-6'

  switch (status) {
    case TxStatus.pending:
      return <Loading size="default" />
    case TxStatus.success:
      return (
        <div
          className={classNames(
            containerClassName,
            'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
          )}
        >
          <CheckCircleIcon className={iconClassName} />
        </div>
      )
    case TxStatus.failed:
      return (
        <div
          className={classNames(
            containerClassName,
            'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-300',
          )}
        >
          <ExclamationCircleIcon className={iconClassName} />
        </div>
      )
  }
}
