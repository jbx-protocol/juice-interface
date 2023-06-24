import { Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import EtherscanLink from 'components/EtherscanLink'
import { useProjectMetadata } from 'components/ProjectDashboard/hooks'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import useMobile from 'hooks/useMobile'
import moment from 'moment'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { ProjectHeaderLogo } from '../../ProjectHeader/components/ProjectHeaderLogo'

export const SuccessPayCard = ({ className }: { className?: string }) => {
  const isMobile = useMobile()
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
        'mx-auto flex w-full max-w-xl flex-col justify-between divide-y divide-grey-200 rounded-lg border border-grey-200 p-6 shadow-[0_4px_14px_0_rgba(0,0,0,0.03)] dark:divide-slate-500 dark:border-slate-500 dark:bg-slate-700 md:flex-row',
        className,
      )}
    >
      <div className="flex w-full justify-between gap-3 pb-6 md:pb-0">
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
            <EtherscanLink
              linkClassName="text-black dark:text-slate-50"
              type="tx"
              value={projectPayReceipt.transactionHash}
            />
          </div>
          {!isMobile && (
            <EthereumAddress
              tooltipDisabled
              address={projectPayReceipt.fromAddress}
              withEnsAvatar
            />
          )}
        </div>
      </div>
      {isMobile && (
        <div className="flex justify-between pt-6">
          <EthereumAddress
            tooltipDisabled
            address={projectPayReceipt.fromAddress}
            withEnsAvatar
          />
        </div>
      )}
    </div>
  )
}
