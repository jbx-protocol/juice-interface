import { t, Trans } from '@lingui/macro'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { OutgoingProjectData } from 'models/outgoingProject'
import { SafeTransactionType } from 'models/safe'
import DiffedSplitList from 'packages/v2v3/components/shared/DiffedSplits/DiffedSplitList'
import FundingCycleDetails from 'packages/v2v3/components/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { deriveNextIssuanceRate } from 'packages/v2v3/utils/fundingCycle'
import { formatReservedRate } from 'packages/v2v3/utils/math'
import { useContext } from 'react'
import { toSplit } from 'utils/splits'
import { LinkToSafeButton } from '../../LinkToSafeButton'
import { useTransactionJBController } from './hooks/useTransactionJBController'

// Currently only supports V2V3 reconfig transactions
export function ReconfigureRichPreview({
  transaction,
  isPastTransaction,
}: {
  transaction: SafeTransactionType
  isPastTransaction?: boolean
}) {
  const {
    fundingCycle: previousFC,
    payoutSplits: diffPayoutSplits,
    distributionLimit: previousDistributionLimit,
    distributionLimitCurrency: previousCurrency,
    reservedTokensSplits: diffReservedSplits,
  } = useContext(V2V3ProjectContext)

  const JBController = useTransactionJBController(transaction)
  if (!JBController) return null

  let dataResult: unknown
  try {
    if (!transaction.data) throw new Error('No transaction data to parse.')

    const parsedTransaction = JBController.interface.parseTransaction({
      data: transaction.data,
    })

    dataResult = parsedTransaction?.args
    if (!dataResult) throw new Error('Failed to parse transaction data.')
  } catch (e) {
    console.error(e)
    return (
      <div className="mx-12 mt-4 mb-0">
        <Trans>Error reading transaction data</Trans>
      </div>
    )
  }

  const decodedData = dataResult as OutgoingProjectData

  const distributionLimitCurrency =
    decodedData._fundAccessConstraints?.[0]?.distributionLimitCurrency
  const distributionLimit =
    decodedData._fundAccessConstraints?.[0]?.distributionLimit
  const reservedRate = decodedData._metadata?.reservedRate
  const payoutSplits = decodedData._groupedSplits?.[0]?.splits
  const reservedTokensSplits = decodedData._groupedSplits?.[1]?.splits

  const weight = deriveNextIssuanceRate({
    weight: decodedData._data.weight,
    previousFC: previousFC,
  })

  const showDiffs = !isPastTransaction

  return (
    <div className="flex cursor-default flex-col">
      <div className="mx-6 mt-2 mb-0">
        {decodedData._memo.length ? (
          <i>{decodedData._memo}</i>
        ) : (
          <i>
            <Trans>This transaction edits the project's cycle.</Trans>
          </i>
        )}
      </div>
      <div
        className="my-4 mx-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <MinimalCollapse header={t`Cycle details`} light>
          <FundingCycleDetails
            fundingCycleMetadata={decodedData._metadata}
            fundingCycle={{
              ...decodedData._data,
              weight,
            }}
            distributionLimit={distributionLimit}
            distributionLimitCurrency={distributionLimitCurrency}
            showDiffs={showDiffs}
          />
        </MinimalCollapse>
        <div className="flex w-full flex-col gap-4 md:w-2/3">
          <MinimalCollapse header={t`Payouts`} light>
            {distributionLimit > 0n ? (
              <DiffedSplitList
                splits={toSplit(payoutSplits)}
                diffSplits={diffPayoutSplits}
                currency={distributionLimitCurrency}
                oldCurrency={previousCurrency}
                totalValue={distributionLimit}
                previousTotalValue={previousDistributionLimit}
                valueFormatProps={{ precision: 4 }}
                showDiffs={showDiffs}
              />
            ) : (
              <span className="text-grey-400 dark:text-slate-200">
                <Trans>This cycle has no payouts.</Trans>
              </span>
            )}
          </MinimalCollapse>
          <MinimalCollapse header={t`Reserved token recipients`} light>
            {reservedRate > 0n ? (
              <DiffedSplitList
                splits={toSplit(reservedTokensSplits)}
                diffSplits={diffReservedSplits}
                totalValue={undefined}
                reservedRate={parseFloat(formatReservedRate(reservedRate))}
                showDiffs={showDiffs}
              />
            ) : (
              <span className="text-grey-400 dark:text-slate-200">
                <Trans>This cycle doesn't reserve any tokens.</Trans>
              </span>
            )}
          </MinimalCollapse>
        </div>
      </div>
      <LinkToSafeButton transaction={transaction} />
    </div>
  )
}
