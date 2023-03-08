import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import DiffedSplitList from 'components/v2v3/shared/DiffedSplits/DiffedSplitList'
import FundingCycleDetails from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { NftRewardTier } from 'models/nftRewards'
import { Split } from 'models/splits'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycle,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'

import {
  deriveNextIssuanceRate,
  getDefaultFundAccessConstraint,
} from 'utils/v2v3/fundingCycle'
import { formatReservedRate, MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

import NftSummarySection from './NftSummarySection'

export function ReconfigurePreview({
  payoutSplits,
  reserveSplits,
  fundingCycleMetadata,
  fundingCycleData,
  fundAccessConstraints,
  nftRewards,
  projectOwnerAddress,
  mustStartAtOrAfter,
}: {
  payoutSplits: Split[]
  reserveSplits: Split[]
  fundingCycleMetadata: V2V3FundingCycleMetadata
  fundingCycleData: V2V3FundingCycleData
  fundAccessConstraints: V2V3FundAccessConstraint[]
  nftRewards?: NftRewardTier[]
  projectOwnerAddress?: string
  mustStartAtOrAfter?: string
}) {
  const {
    fundingCycle: currentFC,
    payoutSplits: currentPayoutSplits,
    reservedTokensSplits: currentReserveSplits,
  } = useContext(V2V3ProjectContext)

  const fundingCycle: V2V3FundingCycle = {
    ...fundingCycleData,
    number: BigNumber.from(1),
    configuration: BigNumber.from(0),
    basedOn: BigNumber.from(0),
    start: mustStartAtOrAfter
      ? BigNumber.from(mustStartAtOrAfter)
      : BigNumber.from(Date.now()).div(1000),
    metadata: BigNumber.from(0),
    weight: deriveNextIssuanceRate({
      weight: fundingCycleData.weight,
      previousFC: currentFC,
    }),
  }

  const fundAccessConstraint = getDefaultFundAccessConstraint(
    fundAccessConstraints,
  )

  const distributionLimit = fundAccessConstraint?.distributionLimit
  const distributionLimitCurrency =
    fundAccessConstraint?.distributionLimitCurrency

  const formattedReservedRate = parseFloat(
    formatReservedRate(fundingCycleMetadata.reservedRate),
  )

  return (
    <Space
      className="mx-6 mb-4 w-full"
      size={'middle'}
      direction={'vertical'}
      onClick={e => e.stopPropagation()}
    >
      <MinimalCollapse header={t`Funding cycle details`} light>
        <FundingCycleDetails
          fundingCycleMetadata={fundingCycleMetadata}
          fundingCycle={fundingCycle}
          distributionLimit={distributionLimit}
          distributionLimitCurrency={distributionLimitCurrency}
          showDiffs
        />
      </MinimalCollapse>
      <Space size={'middle'} direction={'vertical'} className="w-2/3">
        <MinimalCollapse header={t`Funding distribution`} light>
          {distributionLimit?.gt(0) ? (
            <DiffedSplitList
              splits={payoutSplits}
              diffSplits={currentPayoutSplits}
              currency={distributionLimitCurrency}
              totalValue={distributionLimit}
              projectOwnerAddress={projectOwnerAddress}
              showAmounts={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
              valueFormatProps={{ precision: 4 }}
              showDiffs
            />
          ) : (
            <span className="text-grey-400 dark:text-slate-200">
              <Trans>No distributions configured.</Trans>
            </span>
          )}
        </MinimalCollapse>
        <MinimalCollapse header={t`Reserved token allocation`} light>
          {fundingCycleMetadata.reservedRate?.gt(0) ? (
            <DiffedSplitList
              splits={reserveSplits}
              diffSplits={currentReserveSplits}
              projectOwnerAddress={projectOwnerAddress}
              totalValue={undefined}
              reservedRate={formattedReservedRate}
              showDiffs
            />
          ) : (
            <span className="text-grey-400 dark:text-slate-200">
              <Trans>No reserved tokens configured.</Trans>
            </span>
          )}
        </MinimalCollapse>
      </Space>

      {nftRewards ? <NftSummarySection /> : null}
    </Space>
  )
}
