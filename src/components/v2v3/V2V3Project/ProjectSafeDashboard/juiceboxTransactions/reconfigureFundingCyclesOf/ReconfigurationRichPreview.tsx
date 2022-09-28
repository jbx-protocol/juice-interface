import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import SplitList from 'components/v2v3/shared/SplitList'
import FundingCycleDetails from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { OutgoingProjectData } from 'models/outgoingProject'
import { useContext } from 'react'
import { formatOutgoingSplits } from 'utils/splits'
import { formatReservedRate, MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { SafeTransactionComponentProps } from '../../SafeTransaction'

export function ReconfigureRichPreview({
  transaction,
}: SafeTransactionComponentProps) {
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!contracts) return null

  const dataResult: unknown = contracts[
    'JBController'
  ].interface.parseTransaction({
    data: transaction.data ?? '',
  }).args

  const decodedData = dataResult as OutgoingProjectData

  const distributionLimitCurrency =
    decodedData._fundAccessConstraints?.[0]?.distributionLimitCurrency
  const distributionLimit =
    decodedData._fundAccessConstraints?.[0]?.distributionLimit
  const reservedRate = decodedData._metadata?.reservedRate
  const payoutSplits = decodedData._groupedSplits?.[0]?.splits
  const reservedTokensSplits = decodedData._groupedSplits?.[1].splits

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ margin: '1rem 3rem 0' }}>
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
        style={{ margin: '1rem 2rem' }}
        direction={'vertical'}
        onClick={e => e.stopPropagation()}
      >
        <MinimalCollapse header={t`Funding cycle details`} light>
          <FundingCycleDetails
            fundingCycleMetadata={decodedData._metadata}
            fundingCycle={decodedData._data}
            distributionLimit={distributionLimit}
            distributionLimitCurrency={distributionLimitCurrency}
          />
        </MinimalCollapse>
        <MinimalCollapse header={t`Funding distribution`} light>
          {distributionLimit?.gt(0) ? (
            payoutSplits ? (
              <SplitList
                splits={formatOutgoingSplits(payoutSplits)}
                currency={distributionLimitCurrency}
                totalValue={distributionLimit}
                projectOwnerAddress={projectOwnerAddress}
                showSplitValues={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
                valueFormatProps={{ precision: 4 }}
              />
            ) : null
          ) : (
            <span style={{ color: colors.text.tertiary }}>
              <Trans>No distributions configured.</Trans>
            </span>
          )}
        </MinimalCollapse>
        <MinimalCollapse header={t`Reserved token allocation`} light>
          {reservedRate?.gt(0) ? (
            reservedTokensSplits ? (
              <SplitList
                splits={formatOutgoingSplits(reservedTokensSplits)}
                projectOwnerAddress={projectOwnerAddress}
                totalValue={undefined}
                reservedRate={parseFloat(formatReservedRate(reservedRate))}
              />
            ) : null
          ) : (
            <span style={{ color: colors.text.tertiary }}>
              <Trans>No reserved tokens configured.</Trans>
            </span>
          )}
        </MinimalCollapse>
      </Space>
    </div>
  )
}
