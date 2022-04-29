import { CaretRightOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { BigNumber } from '@ethersproject/bignumber'

import { Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'
import { ThemeContext } from 'contexts/themeContext'

import { useContext, useEffect, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import FundingCycleDetails from 'components/v2/V2Project/V2FundingCycleSection/FundingCycleDetails'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import { V2CurrencyName } from 'utils/v2/currency'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useUsedDistributionLimit from 'hooks/v2/contractReader/UsedDistributionLimit'
import { V2UserContext } from 'contexts/v2/userContext'
import { formatDiscountRate, MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'

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
          {!(distributionLimitIsInfinite || distributionLimitIsZero) ? (
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

export default function FundingCycleHistory() {
  const { projectId, fundingCycle: currentFundingCycle } =
    useContext(V2ProjectContext)
  const { contracts } = useContext(V2UserContext)

  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [pastFundingCycles, setPastFundingCycles] = useState<V2FundingCycle[]>(
    [],
  )

  useEffect(() => {
    const loadPastFundingCycles = async () => {
      if (!(projectId && currentFundingCycle)) return []

      const firstFCOfEachReconfiguration: V2FundingCycle[] = []
      const allPastFundingCycles: V2FundingCycle[] = []

      // Add first FC for current configuration
      firstFCOfEachReconfiguration.push(
        (await contracts?.JBFundingCycleStore.get(
          projectId,
          currentFundingCycle.configuration,
        )) as V2FundingCycle,
      )

      let previousReconfiguration = currentFundingCycle.basedOn

      // Get first funding cycle of each reconfiguration
      while (!previousReconfiguration.eq(BigNumber.from(0))) {
        const previousReconfigurationFirstFundingCycle: V2FundingCycle =
          (await contracts?.JBFundingCycleStore.get(
            projectId,
            previousReconfiguration,
          )) as V2FundingCycle

        if (previousReconfigurationFirstFundingCycle) {
          // Add it to the start of list
          ;[previousReconfigurationFirstFundingCycle].concat(
            firstFCOfEachReconfiguration,
          )
          previousReconfiguration =
            previousReconfigurationFirstFundingCycle.basedOn
        }
      }
      // Now fill in gaps between each reconfiguration
      firstFCOfEachReconfiguration.forEach(
        (firstFundingCycleOfReconfiguration, reconfigurationIndex) => {
          allPastFundingCycles.push(firstFundingCycleOfReconfiguration)

          const currentReconfigurationStart =
            firstFundingCycleOfReconfiguration.start
          const nextReconfigurationStart =
            firstFCOfEachReconfiguration.length > 1
              ? firstFCOfEachReconfiguration[reconfigurationIndex + 1].start
              : currentFundingCycle.start
          const currentDuration = firstFundingCycleOfReconfiguration.duration
          const currentDiscountRate =
            firstFundingCycleOfReconfiguration.discountRate

          const numInterimFundingCycles = nextReconfigurationStart
            .sub(currentReconfigurationStart)
            .div(currentDuration)
            .toNumber()

          let interimIndex = 0

          // Initially set to first of the reconfiguration
          let interimWeight: BigNumber =
            firstFundingCycleOfReconfiguration.weight
          let interimStart: BigNumber = firstFundingCycleOfReconfiguration.start
          let interimNumber: BigNumber =
            firstFundingCycleOfReconfiguration.number

          let interimFundingCycle: V2FundingCycle =
            firstFundingCycleOfReconfiguration

          while (interimIndex < numInterimFundingCycles) {
            const nextInterimWeight = interimWeight.sub(
              interimWeight
                .mul(formatDiscountRate(currentDiscountRate))
                .div(100),
            )
            const nextInterimStart = interimStart.add(currentDuration)
            const nextInterimNumber = interimNumber.add(1)

            let nextFundingCycle = {
              duration: interimFundingCycle.duration,
              weight: nextInterimWeight,
              discountRate: interimFundingCycle.discountRate,
              ballot: interimFundingCycle.ballot,
              number: nextInterimNumber,
              configuration: interimFundingCycle.configuration,
              start: nextInterimStart,
              metadata: interimFundingCycle.metadata,
            } as V2FundingCycle

            interimWeight = nextInterimWeight
            interimStart = nextInterimStart
            interimNumber = nextInterimNumber
            interimIndex++

            allPastFundingCycles.push(nextFundingCycle)
          }
        },
      )
      // Cut off current funding cycle
      allPastFundingCycles.pop()

      return allPastFundingCycles.reverse()
    }
    loadPastFundingCycles().then(pastFundingCycles => {
      setPastFundingCycles(pastFundingCycles)
    })
  }, [contracts, projectId, currentFundingCycle])

  if (!projectId || !currentFundingCycle || !currentFundingCycle?.number)
    return null

  const allCyclesLoaded =
    pastFundingCycles.length >= currentFundingCycle.number.toNumber() - 1

  const selectedFC =
    selectedIndex !== undefined ? pastFundingCycles[selectedIndex] : undefined

  const fundingCycleElems = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {pastFundingCycles.length ? (
        pastFundingCycles.map((fundingCycle: V2FundingCycle, i) => (
          <HistoricalFundingCycle
            fundingCycle={fundingCycle}
            numFundingCycles={pastFundingCycles.length}
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
