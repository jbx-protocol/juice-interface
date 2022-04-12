import { CaretRightOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'

import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'
import { ThemeContext } from 'contexts/themeContext'
import useContractReader from 'hooks/v2/contractReader/V2ContractReader'

import { useCallback, useContext, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import FundingCycleDetails from 'components/v2/V2Project/V2FundingCycleSection/FundingCycleDetails'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import { V2ContractName } from 'models/v2/contracts'
import { V2CurrencyName } from 'utils/v2/currency'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useUsedDistributionLimit from 'hooks/v2/contractReader/UsedDistributionLimit'
import { deepEqV2FundingCycles } from 'utils/v2/fundingCycle'

function HistoricalFundingCycle({
  fundingCycle,
  numFundingCycles,
  index,
  setSelectedIndex,
}: {
  fundingCycle: V2FundingCycle
  numFundingCycles: number
  index: number
  setSelectedIndex: (index: number) => void
}) {
  const { projectId, primaryTerminal } = useContext(V2ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { data: distributionLimitData } = useProjectDistributionLimit({
    projectId,
    domain: fundingCycle?.configuration?.toString(),
    terminal: primaryTerminal,
  })

  const { data: usedDistributionLimit } = useUsedDistributionLimit({
    projectId,
    terminal: primaryTerminal,
    fundingCycleNumber: fundingCycle?.number,
  })

  const [distributionLimit, distributionLimitCurrency] =
    distributionLimitData ?? []

  return (
    <div
      key={fundingCycle.number.toString()}
      onClick={() => setSelectedIndex(index)}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        cursor: 'pointer',
        ...(index < numFundingCycles - 1
          ? {
              paddingBottom: 20,
              borderBottom: '1px solid ' + colors.stroke.tertiary,
            }
          : {}),
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
          {distributionLimit && distributionLimit.gt(0) ? (
            <>
              <Trans>
                {formatWad(usedDistributionLimit, { precision: 2 })}/
                {formatWad(distributionLimit, { precision: 2 })} withdrawn
              </Trans>
            </>
          ) : (
            <>
              <Trans>
                {formatWad(usedDistributionLimit, { precision: 2 })} withdrawn
              </Trans>
            </>
          )}
        </div>
      </Space>

      <div style={{ flex: 1 }}></div>

      <Space align="baseline" style={{ fontSize: '.8rem' }}>
        {formatHistoricalDate(
          fundingCycle.start.add(fundingCycle.duration).mul(1000).toNumber(),
        )}
        <CaretRightOutlined />
      </Space>
    </div>
  )
}

export default function FundingCycleHistory({
  startId,
}: {
  startId: BigNumber | undefined
}) {
  const { projectId, fundingCycle } = useContext(V2ProjectContext)
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [fundingCycles, setFundingCycles] = useState<V2FundingCycle[]>([])
  const [cycleIds, setCycleIds] = useState<BigNumber[]>([])

  console.info('startId: ', startId)

  if (startId?.gt(0) && !cycleIds.length) setCycleIds([startId])

  console.info('cycleIds: ', cycleIds)
  console.info('fundingCycles: ', fundingCycles)

  const allCyclesLoaded = fundingCycles.length >= cycleIds.length
  const cycleNumber = allCyclesLoaded
    ? undefined
    : cycleIds[cycleIds.length - 1]
  const selectedFC =
    selectedIndex !== undefined ? fundingCycles[selectedIndex] : undefined

  console.info('cycleNumber: ', cycleNumber)

  useContractReader<V2FundingCycle>({
    contract: V2ContractName.JBFundingCycleStore,
    functionName: 'get',
    args: [projectId?.toHexString(), fundingCycle?.configuration],
    valueDidChange: useCallback((a, b) => !deepEqV2FundingCycles(a, b), []),
    callback: useCallback(
      (cycle: V2FundingCycle | undefined) => {
        console.info('got cycle: ', cycle)
        if (
          !cycle ||
          !cycleNumber ||
          cycleIds.includes(cycle.number) ||
          cycle.number.eq(0)
        )
          return

        setFundingCycles([...fundingCycles, cycle])
        setCycleIds([
          ...cycleIds,
          ...(cycle.number.toNumber() > 0 ? [cycle.number] : []),
        ])
      },
      [cycleNumber, cycleIds, fundingCycles],
    ),
  })

  const fundingCycleElems = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {fundingCycles.length ? (
        fundingCycles.map((fundingCycle: V2FundingCycle, i) => (
          <HistoricalFundingCycle
            fundingCycle={fundingCycle}
            numFundingCycles={fundingCycles.length}
            index={i}
            setSelectedIndex={index => setSelectedIndex(index)}
          />
        ))
      ) : (
        <div>
          <Trans>No past funding cycles</Trans>
        </div>
      )}
    </Space>
  )

  return (
    <div>
      {fundingCycleElems}

      {allCyclesLoaded ? null : <Loading />}

      {selectedFC && (
        <Modal
          visible={!!selectedFC}
          width={600}
          title={`Cycle #${selectedFC.number.toString()}`}
          onCancel={() => setSelectedIndex(undefined)}
          onOk={() => setSelectedIndex(undefined)}
          cancelButtonProps={{ hidden: true }}
          okText={t`Done`}
        >
          <FundingCycleDetails fundingCycle={selectedFC} />
        </Modal>
      )}
    </div>
  )
}
