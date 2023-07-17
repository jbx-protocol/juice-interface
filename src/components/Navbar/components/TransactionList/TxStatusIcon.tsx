import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import Loading from 'components/Loading'
import { TxStatus } from 'models/transaction'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

export default function TxStatusIcon({ status }: { status: TxStatus }) {
  if (status === TxStatus.pending) return <Loading size="default" />

  const Icon = useMemo(() => {
    switch (status) {
      case TxStatus.success:
        return CheckCircleIcon
      case TxStatus.failed:
        return ExclamationCircleIcon
    }
  }, [status])

  return (
    <div
      className={twMerge(
        'flex h-7 w-7 items-center justify-center rounded-full',
        status === TxStatus.success &&
          'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
        status === TxStatus.failed &&
          'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-300',
      )}
    >
      <Icon className="h-6 w-6" />
    </div>
  )
}
