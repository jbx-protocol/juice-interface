import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import SplitList from 'components/v2v3/shared/SplitList'
import FundingCycleDetails from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails'
import { CV_V2, CV_V3 } from 'constants/cv'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useLoadV2V3Contract } from 'hooks/v2v3/LoadV2V3Contract'
import { OutgoingProjectData } from 'models/outgoingProject'
import { SafeTransactionType } from 'models/safe'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { formatOutgoingSplits } from 'utils/splits'
import { deriveNextIssuanceRate } from 'utils/v2v3/fundingCycle'
import { formatReservedRate, MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { LinkToSafeButton } from '../../LinkToSafeButton'

const useTransactionJBController = (transaction: SafeTransactionType) => {
  const V2JBController = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBController,
  })
  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })

  if (transaction.to === V2JBController?.address) {
    return V2JBController
  }

  if (transaction.to === V3JBController?.address) {
    return V3JBController
  }
}

// Currently only supports V2V3 reconfig transactions
export function ReconfigureRichPreview({
  transaction,
}: {
  transaction: SafeTransactionType
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { projectOwnerAddress, fundingCycle: currentFC } =
    useContext(V2V3ProjectContext)

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
      <div style={{ margin: '1rem 3rem 0' }}>
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

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', cursor: 'default' }}
    >
      <div style={{ margin: '0.5rem 1.5rem 0' }}>
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
        size={'middle'}
        style={{ margin: '1rem 1.5rem' }}
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
          />
        </MinimalCollapse>
        <MinimalCollapse header={t`Funding distribution`} light>
          {distributionLimit?.gt(0) ? (
            <SplitList
              splits={formatOutgoingSplits(payoutSplits)}
              currency={distributionLimitCurrency}
              totalValue={distributionLimit}
              projectOwnerAddress={projectOwnerAddress}
              showSplitValues={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
              valueFormatProps={{ precision: 4 }}
            />
          ) : (
            <span style={{ color: colors.text.tertiary }}>
              <Trans>No distributions configured.</Trans>
            </span>
          )}
        </MinimalCollapse>
        <MinimalCollapse header={t`Reserved token allocation`} light>
          {reservedRate?.gt(0) ? (
            <SplitList
              splits={formatOutgoingSplits(reservedTokensSplits)}
              projectOwnerAddress={projectOwnerAddress}
              totalValue={undefined}
              reservedRate={parseFloat(formatReservedRate(reservedRate))}
            />
          ) : (
            <span style={{ color: colors.text.tertiary }}>
              <Trans>No reserved tokens configured.</Trans>
            </span>
          )}
        </MinimalCollapse>
      </Space>
      <LinkToSafeButton transaction={transaction} />
    </div>
  )
}
