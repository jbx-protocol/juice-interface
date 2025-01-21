import { plural, t } from '@lingui/macro'

import { readNetwork } from 'constants/networks'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { constants } from 'ethers'
import { NetworkName } from 'models/networkName'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'

type BallotOption = Record<
  'ONE_DAY' | 'THREE_DAY' | 'SEVEN_DAY',
  Partial<Record<NetworkName, string>>
>

// v4TODO: Apply real v4 addresses
const BALLOT_ADDRESSES: BallotOption = {
  ONE_DAY: {
    mainnet: '0xDd9303491328F899796319C2b6bD614324b86314',
    sepolia: '0x34E2992ea3C3E6CcfCf5bC668B68F285C1EDFE24',
  },
  THREE_DAY: {
    mainnet: '0x19D8C293D35EA4b2879A864A68D45a2025694929',
    sepolia: '0xa2154aBD135be068540073cB4390139906d0FDc6',
  },
  SEVEN_DAY: {
    mainnet: '0x8E1AEc30063565e597705E71Ba14Dffc4C390Ef0',
    sepolia: '0xb958fEa9089208d0Cc990EceCEcc42458F1B618e',
  },
}

interface BallotStrategy {
  id: ReconfigurationStrategy
  name: string
  description: string
  address: string
  durationSeconds: number
}

const durationBallotStrategyDescription = (days: number) =>
  plural(days, {
    one: 'Edits to an upcoming ruleset cycle must be submitted at least # day before that ruleset cycle starts.',
    other:
      'Edits to an upcoming ruleset cycle must be submitted at least # days before that ruleset cycle starts.',
  })

export function ballotStrategiesFn({
  network,
}: {
  network?: NetworkName
} = {}): BallotStrategy[] {
  const ballotStrategies: BallotStrategy[] = [
    {
      id: 'none',
      name: t`No deadline`,
      description: t`Edits to upcoming ruleset cycles will take effect when the current ruleset cycle ends. A project with no deadline is vulnerable to last-second edits by its owner.`,
      address: constants.AddressZero,
      durationSeconds: 0,
    },
    {
      id: 'oneDay',
      name: t`1-day deadline`,
      description: durationBallotStrategyDescription(1),
      address: BALLOT_ADDRESSES.ONE_DAY[network ?? readNetwork.name]!,
      durationSeconds: SECONDS_IN_DAY,
    },
    {
      id: 'threeDay',
      name: t`3-day deadline`,
      description: durationBallotStrategyDescription(3),
      address: BALLOT_ADDRESSES.THREE_DAY[network ?? readNetwork.name]!,
      durationSeconds: SECONDS_IN_DAY * 3,
    },
    {
      id: 'sevenDay',
      name: t`7-day deadline`,
      description: durationBallotStrategyDescription(7),
      address: BALLOT_ADDRESSES.SEVEN_DAY[network ?? readNetwork.name]!,
      durationSeconds: SECONDS_IN_DAY * 7,
    },
  ]
  return ballotStrategies
}
