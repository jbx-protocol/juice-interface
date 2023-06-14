import { LinkIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { useProjectMetadata } from 'components/ProjectDashboard/hooks'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import moment from 'moment'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { ProjectHeaderLogo } from '../../ProjectHeader/components/ProjectHeaderLogo'

export const SuccessPayCard = ({ className }: { className?: string }) => {
  const { name } = useProjectMetadata().projectMetadata ?? {}
  const { projectPayReceipt } = useProjectPageQueries()

  const transactionDateString = useMemo(() => {
    if (!projectPayReceipt?.timestamp) return null
    const timestampMs = projectPayReceipt.timestamp.getTime()
    return `${moment(timestampMs).fromNow(true)} ago`
  }, [projectPayReceipt?.timestamp])

  if (!projectPayReceipt || !transactionDateString) return null

  return (
    <div
      className={twMerge(
        'mx-auto flex w-full max-w-xl justify-between gap-3 rounded-lg border border-grey-200 p-6 shadow dark:border-slate-500 dark:bg-slate-700',
        className,
      )}
    >
      <div className="flex gap-3 text-start">
        <ProjectHeaderLogo className="h-20 w-20 bg-white" />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-grey-500 dark:text-slate-200">
            <Trans>Paid</Trans>
          </span>
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="font-heading text-2xl font-medium">
            {formatCurrencyAmount({
              ...projectPayReceipt.totalAmount,
              withScale: true,
            })}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2 ">
          <span className="text-xs text-grey-500 dark:text-slate-200">
            {transactionDateString}
          </span>
          <LinkIcon className="h-4 w-4 text-black dark:text-slate-50" />
        </div>
        <EthereumAddress
          address={projectPayReceipt.fromAddress}
          withEnsAvatar
        />
      </div>
    </div>
  )
}
