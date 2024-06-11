import { BigNumber } from '@ethersproject/bignumber'
import EthereumAddress from 'components/EthereumAddress'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useProjectSplits from 'hooks/v2v3/contractReader/useProjectSplits'
import round from 'lodash/round'
import React, { useContext } from 'react'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { isProjectSplit } from 'utils/splits'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { derivePayoutAmount } from 'utils/v2v3/distributions'
import { ConfigurationPanelTableData } from './ConfigurationPanel'
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
