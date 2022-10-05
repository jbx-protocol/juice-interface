import { Contract } from '@ethersproject/contracts'
import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import SplitList from 'components/v2v3/shared/SplitList'
import FundingCycleDetails from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { OutgoingProjectData } from 'models/outgoingProject'
import { SafeTransactionType } from 'models/safe'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext, useEffect, useState } from 'react'
import { formatOutgoingSplits } from 'utils/splits'
import { loadJuiceboxV2Contract } from 'utils/v2v3/contractLoaders/JuiceboxV2'
import { loadJuiceboxV3Contract } from 'utils/v2v3/contractLoaders/JuiceboxV3'
import { formatReservedRate, MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

const useTransactionJBController = (transaction: SafeTransactionType) => {
  const [JBController, setJBController] = useState<Contract | undefined>()

  useEffect(() => {
    async function load() {
      const [V2JBController, V3JBController] = await Promise.all([
        loadJuiceboxV2Contract(V2V3ContractName.JBController, readNetwork.name),
        loadJuiceboxV3Contract(V2V3ContractName.JBController, readNetwork.name),
      ])

      if (transaction.to === V2JBController?.address) {
        setJBController(
          new Contract(
            V2JBController.address,
            V2JBController.abi,
            readProvider,
          ),
        )
      } else if (transaction.to === V3JBController?.address) {
        setJBController(
          new Contract(
            V3JBController.address,
            V3JBController.abi,
            readProvider,
          ),
        )
      }
    }

    load()
  }, [transaction.to])

  return JBController
}

export function ReconfigureRichPreview({
  transaction,
}: {
  transaction: SafeTransactionType
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

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
