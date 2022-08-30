import { CaretRightOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'

import { Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import CurrencySymbol from 'components/CurrencySymbol'
import Loading from 'components/Loading'
import { ThemeContext } from 'contexts/themeContext'

import { useContext, useEffect, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import FundingCycleDetails from 'components/v2/V2Project/V2FundingCycleSection/FundingCycleDetails'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useUsedDistributionLimit from 'hooks/v2/contractReader/UsedDistributionLimit'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import { V2CurrencyName } from 'utils/v2/currency'
import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'
import { formatDiscountRate, MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'

// Fill in gaps between first funding cycle of each configuration:
//     - derives starts from duration and start time of the first FC of that configuration
//     - derives weights from discount rate and weight of the first FC of the configuration
//     - derives number by incrementing
//     - everything else the same as the first FC of the configuration
const deriveFundingCyclesBetweenEachConfiguration = ({
  firstFCOfEachConfiguration,
  currentFundingCycle,
}: {
  firstFCOfEachConfiguration: V2FundingCycle[]
  currentFundingCycle: V2FundingCycle
}) => {
  const allFundingCycles: V2FundingCycle[] = []

  firstFCOfEachConfiguration.forEach(
    (firstFundingCycleOfConfiguration, configurationIndex) => {
      allFundingCycles.push(firstFundingCycleOfConfiguration)

      const currentReconfigurationStart = firstFundingCycleOfConfiguration.start
      const nextConfigurationStart =
        configurationIndex < firstFCOfEachConfiguration.length - 1
          ? firstFCOfEachConfiguration[configurationIndex + 1].start
          : currentFundingCycle.start
      const currentDuration = firstFundingCycleOfConfiguration.duration
      const currentDiscountRate = firstFundingCycleOfConfiguration.discountRate

      let numInterimFundingCycles: number

      if (currentDuration && !currentDuration.eq(0)) {
        numInterimFundingCycles = nextConfigurationStart
          .sub(currentReconfigurationStart)
          .div(currentDuration)
          .toNumber()
      } else {
        numInterimFundingCycles = 0
      }

      const isLastConfiguration =
        configurationIndex === firstFCOfEachConfiguration.length - 1

      let interimIndex = 0

      // Initially set to first of the reconfiguration
      let interimWeight: BigNumber = firstFundingCycleOfConfiguration.weight
      let interimStart: BigNumber = firstFundingCycleOfConfiguration.start
      let interimNumber: BigNumber = firstFundingCycleOfConfiguration.number

      const interimFundingCycle: V2FundingCycle =
        firstFundingCycleOfConfiguration

      while (interimIndex < numInterimFundingCycles) {
        // This is to prevent doubling up of an extrapolated FC and the first FC
        // of the next configuration.
        if (
          !isLastConfiguration &&
          interimIndex === numInterimFundingCycles - 1
        ) {
          break
        }
        const nextInterimWeight = interimWeight.sub(
          interimWeight.mul(formatDiscountRate(currentDiscountRate)).div(100),
        )
        const nextInterimStart = interimStart.add(currentDuration)
        const nextInterimNumber = interimNumber.add(1)

        const nextFundingCycle = {
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

        allFundingCycles.push(nextFundingCycle)
      }
    },
  )

  return allFundingCycles
}

function HistoricalFundingCycle({
  fundingCycle,
  numFundingCycles,
  index,
  onClick,
}: {
  fundingCycle: V2FundingCycle
  numFundingCycles: number
  index: number
  onClick: VoidFunction
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

  const isLastFundingCycle = index < numFundingCycles - 1

  return (
    <div
      key={fundingCycle.number.toString()}
      role="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        cursor: 'pointer',
        ...(isLastFundingCycle
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
  const {
    projectId,
    fundingCycle: currentFundingCycle,
    primaryTerminal,
  } = useContext(V2ProjectContext)
  const { contracts } = useContext(V2UserContext)

  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [pastFundingCycles, setPastFundingCycles] = useState<V2FundingCycle[]>(
    [],
  )

  const selectedFundingCycle =
    selectedIndex !== undefined ? pastFundingCycles[selectedIndex] : undefined

  const { data: distributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: selectedFundingCycle?.configuration?.toString(),
    terminal: primaryTerminal,
  })

  const [distributionLimit, distributionLimitCurrency] =
    distributionLimitData ?? []

  useEffect(() => {
    const loadPastFundingCycles = async () => {
      if (!(projectId && currentFundingCycle)) return []

      const firstFCOfCurrentConfiguration =
        await contracts?.JBFundingCycleStore.get(
          projectId,
          currentFundingCycle.configuration,
        )

      let firstFCOfEachConfiguration: V2FundingCycle[] = [
        firstFCOfCurrentConfiguration,
      ]

      let previousReconfiguration = currentFundingCycle.basedOn

      // Get first funding cycle of each configuration using basedOn
      while (!previousReconfiguration.eq(BigNumber.from(0))) {
        const previousReconfigurationFirstFundingCycle: V2FundingCycle =
          (await contracts?.JBFundingCycleStore.get(
            projectId,
            previousReconfiguration,
          )) as V2FundingCycle

        if (previousReconfigurationFirstFundingCycle) {
          // Add it to the start of list
          firstFCOfEachConfiguration = [
            previousReconfigurationFirstFundingCycle,
          ].concat(firstFCOfEachConfiguration)
          previousReconfiguration =
            previousReconfigurationFirstFundingCycle.basedOn
        }
      }

      const allFundingCycles = deriveFundingCyclesBetweenEachConfiguration({
        firstFCOfEachConfiguration,
        currentFundingCycle,
      })

      // Cut off the current funding cycle
      const allPastFundingCycles = allFundingCycles.slice(0, -1)

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

  const FundingCycles = () => (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', maxHeight: '80vh', overflow: 'auto' }}
    >
      {pastFundingCycles.length ? (
        pastFundingCycles.map((fundingCycle: V2FundingCycle, i) => (
          <HistoricalFundingCycle
            key={fundingCycle.configuration.toString()}
            fundingCycle={fundingCycle}
            numFundingCycles={pastFundingCycles.length}
            index={i}
            onClick={() => setSelectedIndex(i)}
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
      {allCyclesLoaded ? <FundingCycles /> : <Loading />}

      {selectedFundingCycle && (
        <Modal
          visible={Boolean(selectedFundingCycle)}
          width={600}
          title={`Cycle #${selectedFundingCycle.number.toString()}`}
          onCancel={() => setSelectedIndex(undefined)}
          onOk={() => setSelectedIndex(undefined)}
          cancelButtonProps={{ hidden: true }}
          okText={t`Done`}
        >
          <FundingCycleDetails
            fundingCycle={selectedFundingCycle}
            fundingCycleMetadata={decodeV2FundingCycleMetadata(
              selectedFundingCycle.metadata,
            )}
            distributionLimit={distributionLimit}
            distributionLimitCurrency={distributionLimitCurrency}
          />
        </Modal>
      )}
    </div>
  )
}
