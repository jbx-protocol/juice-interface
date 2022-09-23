import { BigNumber } from '@ethersproject/bignumber'
import {
  V2FundingCycleMetadata,
  V2V3FundingCycle,
} from 'models/v2/fundingCycle'
import { V2V3Contracts } from 'models/v2v3/contracts'
import { formatDiscountRate } from 'utils/v2v3/math'

// Fill in gaps between first funding cycle of each configuration:
//     - derives starts from duration and start time of the first FC of that configuration
//     - derives weights from discount rate and weight of the first FC of the configuration
//     - derives number by incrementing
//     - everything else the same as the first FC of the configuration
const deriveFundingCyclesBetweenEachConfiguration = ({
  firstFCOfEachConfiguration,
  currentFundingCycle,
}: {
  firstFCOfEachConfiguration: [V2V3FundingCycle, V2FundingCycleMetadata][]
  currentFundingCycle: V2V3FundingCycle
}) => {
  const allFundingCycles: [V2V3FundingCycle, V2FundingCycleMetadata][] = []

  firstFCOfEachConfiguration.forEach(
    (firstFundingCycleOfConfiguration, configurationIndex) => {
      allFundingCycles.push(firstFundingCycleOfConfiguration)

      const [fundingCycle, fundingCycleMetadata] =
        firstFundingCycleOfConfiguration

      const currentReconfigurationStart = fundingCycle.start
      const nextConfigurationStart =
        configurationIndex < firstFCOfEachConfiguration.length - 1
          ? firstFCOfEachConfiguration[configurationIndex + 1][0].start
          : currentFundingCycle.start
      const currentDuration = fundingCycle.duration
      const currentDiscountRate = fundingCycle.discountRate

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
      let interimWeight: BigNumber = fundingCycle.weight
      let interimStart: BigNumber = fundingCycle.start
      let interimNumber: BigNumber = fundingCycle.number

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
          duration: fundingCycle.duration,
          weight: nextInterimWeight,
          discountRate: fundingCycle.discountRate,
          ballot: fundingCycle.ballot,
          number: nextInterimNumber,
          configuration: fundingCycle.configuration,
          start: nextInterimStart,
          metadata: fundingCycle.metadata,
        } as V2V3FundingCycle

        interimWeight = nextInterimWeight
        interimStart = nextInterimStart
        interimNumber = nextInterimNumber
        interimIndex += 1

        allFundingCycles.push([nextFundingCycle, fundingCycleMetadata])
      }
    },
  )

  return allFundingCycles
}

export const fetchPastFundingCycles = async ({
  projectId,
  currentFundingCycle,
  contracts,
}: {
  projectId: number
  currentFundingCycle: V2V3FundingCycle
  contracts: V2V3Contracts
}): Promise<[V2V3FundingCycle, V2FundingCycleMetadata][]> => {
  const firstFCOfCurrentConfiguration =
    (await contracts?.JBController.getFundingCycleOf(
      projectId,
      currentFundingCycle.configuration,
    )) as [V2V3FundingCycle, V2FundingCycleMetadata]

  let firstFCOfEachConfiguration: [V2V3FundingCycle, V2FundingCycleMetadata][] =
    [firstFCOfCurrentConfiguration]

  let previousReconfiguration = currentFundingCycle.basedOn
  // Get first funding cycle of each configuration using basedOn
  while (!previousReconfiguration.eq(BigNumber.from(0))) {
    const previousReconfigurationFirstFundingCycle =
      (await contracts?.JBController.getFundingCycleOf(
        projectId,
        previousReconfiguration,
      )) as [V2V3FundingCycle, V2FundingCycleMetadata]

    if (previousReconfigurationFirstFundingCycle) {
      // Add it to the start of list
      firstFCOfEachConfiguration = [
        previousReconfigurationFirstFundingCycle,
      ].concat(firstFCOfEachConfiguration)
      previousReconfiguration =
        previousReconfigurationFirstFundingCycle[0].basedOn
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
