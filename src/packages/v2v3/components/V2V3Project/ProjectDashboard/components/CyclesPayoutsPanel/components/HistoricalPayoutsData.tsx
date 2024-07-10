import { BigNumber } from '@ethersproject/bignumber'
import EthereumAddress from 'components/EthereumAddress'
import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import round from 'lodash/round'
import V2V3ProjectHandleLink from 'packages/v2v3/components/shared/V2V3ProjectHandleLink'
import useProjectSplits from 'packages/v2v3/hooks/contractReader/useProjectSplits'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { derivePayoutAmount } from 'packages/v2v3/utils/distributions'
import React, { useContext } from 'react'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { isProjectSplit } from 'utils/splits'
import { ConfigurationTable } from './ConfigurationTable'
import { HistoricalConfigurationPanelProps } from './HistoricalConfigurationPanel'

export const HistoricalPayoutsData: React.FC<
  HistoricalConfigurationPanelProps
> = p => {
  const { projectId } = useContext(ProjectMetadataContext)

  const config = p.fundingCycle?.configuration?.toString()
  const { data: payoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: config,
  })

  const currency = p.withdrawnAmountAndCurrency.currency
  const withdrawnAmount = p.withdrawnAmountAndCurrency.amount

  const payoutSplitsData =
    payoutSplits?.reduce<ConfigurationPanelTableData>((acc, split) => {
      const key = `${split.beneficiary}-${split.projectId}`
      const isProject = isProjectSplit(split)
      const payoutAmount = round(
        derivePayoutAmount({
          payoutSplit: split,
          distributionLimit: withdrawnAmount,
        }),
        currency === V2V3_CURRENCY_ETH ? 4 : 2,
      )

      const formattedPayout =
        formatCurrencyAmount({
          amount: payoutAmount,
          currency,
        }) ?? '0'

      acc[key] = {
        name: isProject ? (
          <V2V3ProjectHandleLink
            className="truncate"
            containerClassName="truncate"
            projectId={BigNumber.from(split.projectId).toNumber()}
          />
        ) : (
          <EthereumAddress address={split.beneficiary} />
        ),
        new: <span>{formattedPayout}</span>,
      }
      return acc
    }, {}) ?? {}

  return (
    <>
      {payoutSplits && payoutSplits.length ? (
        <ConfigurationTable title="Payouts" data={payoutSplitsData} />
      ) : null}
    </>
  )
}
