import { CaretRightOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import useUsedDistributionLimit from 'hooks/v2v3/contractReader/useUsedDistributionLimit'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext, useState } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { formatWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import FundingCycleDetails from '../FundingCycleDetails'

export function PastFundingCycle({
  fundingCycle,
  fundingCycleMetadata,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { primaryETHTerminal } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: distributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: fundingCycle?.configuration?.toString(),
    terminal: primaryETHTerminal,
  })

  const { data: usedDistributionLimit } = useUsedDistributionLimit({
    projectId,
    terminal: primaryETHTerminal,
    fundingCycleNumber: fundingCycle?.number,
  })

  const [distributionLimit, distributionLimitCurrency] =
    distributionLimitData ?? []

  const distributionLimitIsInfinite = distributionLimit?.eq(
    MAX_DISTRIBUTION_LIMIT,
  )
  const distributionLimitIsZero = !distributionLimit || distributionLimit?.eq(0)

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between"
        role="button"
        onClick={() => setModalVisible(true)}
      >
        <div className="flex items-center gap-2">
          {/* Ant fucking d.... */}
          <h3 className="mb-0">#{fundingCycle.number.toString()}</h3>

          <div className="ml-2 text-sm">
            <CurrencySymbol
              currency={V2V3CurrencyName(
                distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
              )}
            />
            {!distributionLimitIsInfinite && !distributionLimitIsZero ? (
              <Trans>
                {formatWad(usedDistributionLimit, { precision: 2 })}/
                {formatWad(distributionLimit, { precision: 2 })} withdrawn
              </Trans>
            ) : (
              <Trans>
                {formatWad(usedDistributionLimit, { precision: 2 })} withdrawn
              </Trans>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {formatHistoricalDate(
            fundingCycle.start.add(fundingCycle.duration).mul(1000).toNumber(),
          )}
          <CaretRightOutlined />
        </div>
      </div>

      <Modal
        open={modalVisible}
        title={`Cycle #${fundingCycle?.number.toString()}`}
        onCancel={() => setModalVisible(false)}
        onOk={() => setModalVisible(false)}
        cancelButtonProps={{ hidden: true }}
        okText={t`Done`}
      >
        <FundingCycleDetails
          fundingCycle={fundingCycle}
          fundingCycleMetadata={fundingCycleMetadata}
          distributionLimit={distributionLimit}
          distributionLimitCurrency={distributionLimitCurrency}
        />
      </Modal>
    </>
  )
}
