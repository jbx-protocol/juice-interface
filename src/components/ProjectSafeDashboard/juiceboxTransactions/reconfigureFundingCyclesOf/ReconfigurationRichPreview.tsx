import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import DiffedSplitList from 'components/v2v3/shared/DiffedSplits/DiffedSplitList'
import FundingCycleDetails from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { OutgoingProjectData } from 'models/outgoingProject'
import { SafeTransactionType } from 'models/safe'
import { useContext } from 'react'
import { formatOutgoingSplits } from 'utils/splits'
import { deriveNextIssuanceRate } from 'utils/v2v3/fundingCycle'
import { formatReservedRate, MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { LinkToSafeButton } from '../../LinkToSafeButton'
import { useTransactionJBController } from './hooks/TransactionJBController'

// Currently only supports V2V3 reconfig transactions
export function ReconfigureRichPreview({
  transaction,
  isPastTransaction,
}: {
  transaction: SafeTransactionType
  isPastTransaction?: boolean
}) {
  const {
    projectOwnerAddress,
    fundingCycle: currentFC,
    payoutSplits: diffPayoutSplits,
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
    previousFC: currentFC,
  })

  const showDiffs = !isPastTransaction

  return (
    <div className="flex cursor-default flex-col">
      <div className="mx-6 mt-2 mb-0">
        {decodedData._memo.length ? (
          <i>{decodedData._memo}</i>
        ) : (
          <i>
            <Trans>
              This transaction reconfigures the project's funding cycle.
            </Trans>
          </i>
        )}
      </div>
      <Space
        className="my-4 mx-6"
        size={'middle'}
        direction={'vertical'}
        onClick={e => e.stopPropagation()}
      >
        <MinimalCollapse header={t`Funding cycle details`} light>
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
        <Space size={'middle'} direction={'vertical'} className="w-2/3">
          <MinimalCollapse header={t`Funding distribution`} light>
            {distributionLimit?.gt(0) ? (
              <DiffedSplitList
                splits={formatOutgoingSplits(payoutSplits)}
                diffSplits={diffPayoutSplits}
                currency={distributionLimitCurrency}
                totalValue={distributionLimit}
                projectOwnerAddress={projectOwnerAddress}
                showAmounts={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
                valueFormatProps={{ precision: 4 }}
                showDiffs={showDiffs}
              />
            ) : (
              <span className="text-grey-400 dark:text-slate-200">
                <Trans>No distributions configured.</Trans>
              </span>
            )}
          </MinimalCollapse>
          <MinimalCollapse header={t`Reserved token allocation`} light>
            {reservedRate?.gt(0) ? (
              <DiffedSplitList
                splits={formatOutgoingSplits(reservedTokensSplits)}
                diffSplits={diffReservedSplits}
                projectOwnerAddress={projectOwnerAddress}
                totalValue={undefined}
                reservedRate={parseFloat(formatReservedRate(reservedRate))}
                showDiffs={showDiffs}
              />
            ) : (
              <span className="text-grey-400 dark:text-slate-200">
                <Trans>No reserved tokens configured.</Trans>
              </span>
            )}
          </MinimalCollapse>
        </Space>
      </Space>
      <LinkToSafeButton transaction={transaction} />
    </div>
  )
}
