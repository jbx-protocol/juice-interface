import { CaretRightOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useUsedDistributionLimit from 'hooks/v2/contractReader/UsedDistributionLimit'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2FundingCycle, V2FundingCycleMetadata } from 'models/v2/fundingCycle'
import { useContext, useState } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { formatWad } from 'utils/format/formatNumber'
import { V2CurrencyName } from 'utils/v2/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'
import FundingCycleDetails from '../FundingCycleDetails'

export function PastFundingCycle({
  fundingCycle,
  fundingCycleMetadata,
}: {
  fundingCycle: V2FundingCycle
  fundingCycleMetadata: V2FundingCycleMetadata
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { primaryTerminal } = useContext(V2ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: distributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: fundingCycle?.configuration?.toString(),
    terminal: primaryTerminal,
  })

  const { data: usedDistributionLimit } = useUsedDistributionLimit({
    projectId,
    terminal: primaryTerminal,
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
        role="button"
        onClick={() => setModalVisible(true)}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <Space align="baseline">
          <h3>#{fundingCycle.number.toString()}</h3>

          <div style={{ fontSize: '.8rem', marginLeft: 10 }}>
            <CurrencySymbol
              currency={V2CurrencyName(
                distributionLimitCurrency?.toNumber() as V2CurrencyOption,
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
        </Space>

        <Space align="baseline" style={{ fontSize: '.8rem' }}>
          {formatHistoricalDate(
            fundingCycle.start.add(fundingCycle.duration).mul(1000).toNumber(),
          )}
          <CaretRightOutlined />
        </Space>
      </div>

      <Modal
        visible={modalVisible}
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
